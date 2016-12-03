package ui;

import game.*;

import java.awt.*;
import java.awt.image.BufferStrategy;
import java.util.Random;

import static game.GameObjectIDs.basicEnemy;

/**
 * Created by kevin on 2016-09-12.
 */
public class Game extends Canvas implements Runnable{

    public static final int width = 800;
    public static final int height = width / 12 * 9;
    private Color backgroundColour = Color.getHSBColor(0.56f, 0.4f, 0.7f);
    private String title = "Fractals";
    private int MaxObjects = 25;

    private Thread thread;
    private Boolean running = false;

    private Random r;
    private GameHandler gameHandler;
    private HUD hud;
    private SpawnSystem spawn;

    public Game() {
        gameHandler = new GameHandler();
        this.addKeyListener(new KeyInput(gameHandler));

        new Window(width, height, title, this);

        hud = new HUD();
        spawn = new SpawnSystem(gameHandler, hud);

        r = new Random();

        gameHandler.addObject(new Player(width / 2 -32, height / 2 - 32, GameObjectIDs.player, gameHandler));
        //gameHandler.addObject(new Player(width / 2 -32, height / 2, GameObjectIDs.player2));
        for (int i = 0; i < 10; i ++) {
            gameHandler.addObject(new BasicEnemy(r.nextInt(width), r.nextInt(height), basicEnemy, gameHandler));
        }

    }

    public synchronized void start() {
        thread = new Thread(this);
        thread.start();
        running = true;
    }

    public synchronized void stop() {
        try {
            thread.join();
            running = false;}
        catch (Exception e) {
            e.printStackTrace();}
    }

    public static void main(String args[]){
        new Game();
    }

    @Override
    public void run() {
        this.requestFocus();
        long lastTime = System.nanoTime();
        double amountOfTicks = 60.0;
        double ns = 1000000000 / amountOfTicks;
        double delta = 0;
        long timer = System.currentTimeMillis();
        int frames = 0;
        while (running) {
            long now = System.nanoTime();
            delta += (now - lastTime) / ns;
            lastTime = now;
            while (delta >= 1) {
                tick();
                delta--;
            }
            if (running)
                render();
            frames++;

            if (System.currentTimeMillis() - timer > 1000) {
                timer += 1000;
                System.out.println("FPS: " + frames);
                frames = 0;
            }
        }
        stop();
    }

    private void tick() {
        gameHandler.tick();
        hud.tick();
    }

    private void render() {
        BufferStrategy bs = this.getBufferStrategy();
        if (bs == null) {
            this.createBufferStrategy(3);
            return;
        }
        Graphics g = bs.getDrawGraphics();
        g.setColor(backgroundColour);
        g.fillRect(0, 0, width, height);
        gameHandler.render(g);
        hud.render(g);

        g.dispose();
        bs.show();
    }


}
