package game;

import java.awt.*;
import java.util.ArrayList;
import java.util.LinkedList;

import static game.GameObjectIDs.player;

/**
 * Created by kevin on 2016-09-13.
 */
public class GameHandler {

    LinkedList<GameObject> objects = new LinkedList<>();


    public void tick() {
        for (int i = 0; i < objects.size(); i++) {
            GameObject temp = objects.get(i);
            temp.tick();
        }
    }

    public void render(Graphics g) {
        for (int i = 0; i < objects.size(); i++) {
            GameObject temp = objects.get(i);
            temp.render(g);
        }
    }

    public void addObject(GameObject g) {
        this.objects.add(g);
    }

    public void removeObject(GameObject g) {
        if (objects.contains(g))
        this.objects.remove(g);
    }

    public void initializeObjects() {
        objects.clear();
        objects.add(new Player(300, 300, GameObjectIDs.player, this));
    }

}
