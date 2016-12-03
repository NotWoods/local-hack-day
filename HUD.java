package ui;

import game.GameObject;

import java.awt.*;

/**
 * Created by kevin on 2016-09-14.
 */
public class HUD {

    public static int health = 100;
    public static int points = 1;
    public static int stage = 0;
    private int greenValue = 255;
    private int blueValue = 255;

    public void tick() {
        points++;
        if (points >= (stage*1000))
            stage++;
        GameObject.clamp(health, 0, 100);

        greenValue = 255 * health / 100;
        greenValue = GameObject.clamp(greenValue, 0, 255);
        blueValue = 255 * health / 100;
        blueValue = GameObject.clamp(blueValue, 0, 255);

    }

    public void render(Graphics g) {
        g.setColor(Color.BLUE);
        g.drawString("Points: " + Integer.toString(points), Game.width /2 - 26, 25);
        g.drawString("Stage: " + Integer.toString(stage), Game.width /2 - 26, 45);
        g.setColor(new Color(0, greenValue, blueValue));
        g.fillRect(10, 10, health*2, 12);
        g.setColor(Color.CYAN);
        g.drawRect(10, 10, 200, 12);
    }

    public int getPoints() {
        return points;
    }

    public int getStage() {
        return stage;
    }
}
