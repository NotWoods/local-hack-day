package game;


import java.awt.*;

/**
 * Created by kevin on 2016-09-13.
 */
public abstract class GameObject {
    protected int x;
    protected int y;
    protected GameObjectIDs id;
    protected int dx;
    protected int dy;

    public GameObject(int x, int y, GameObjectIDs id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

    public abstract void tick();

    public abstract void render(Graphics g);

    public abstract Rectangle getBounds();

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public GameObjectIDs getId() {
        return id;
    }

    public void setId(GameObjectIDs id) {
        this.id = id;
    }

    public int getDx() {
        return dx;
    }

    public void setDx(int dx) {
        this.dx = dx;
    }

    public int getDy() {
        return dy;
    }

    public void setDy(int dy) {
        this.dy = dy;
    }

    public static int clamp(int val, int min, int max) {
        if (val >= max)
            return max;
        else if (val <= min)
            return min;
        else return val;
    }
}