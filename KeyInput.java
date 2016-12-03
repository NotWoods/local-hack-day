package game;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

/**
 * Created by kevin on 2016-09-13.
 */
public class KeyInput extends KeyAdapter {

    private GameHandler gameHandler;

    private int playerSpeed = 5;

    private boolean wHeld = false;
    private boolean sHeld = false;
    private boolean aHeld = false;
    private boolean dHeld = false;

    private boolean upHeld = false;
    private boolean downHeld = false;
    private boolean leftHeld = false;
    private boolean rightHeld = false;


    public KeyInput(GameHandler gameHandler) {
        this.gameHandler = gameHandler;
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();
        if (key == KeyEvent.VK_ESCAPE) System.exit(1);
        for (GameObject temp : gameHandler.objects) {
            if (temp.getId() == GameObjectIDs.player) {
                //key events related to player
                if (key == KeyEvent.VK_W) {
                    wHeld = true;
                    if (wHeld && aHeld) {
                        temp.setDy(-playerSpeed);
                        temp.setDx(-playerSpeed);
                    }
                    else if (wHeld && dHeld) {
                        temp.setDy(-playerSpeed);
                        temp.setDx(playerSpeed);
                    }
                    else temp.setDy(-playerSpeed);
                }
                if (key == KeyEvent.VK_S) {
                    sHeld = true;
                    if (sHeld && aHeld) {
                        temp.setDy(playerSpeed);
                        temp.setDx(-playerSpeed);
                    }
                    else if (sHeld && dHeld) {
                        temp.setDy(playerSpeed);
                        temp.setDx(playerSpeed);
                    }
                    else temp.setDy(playerSpeed);
                }
                if (key == KeyEvent.VK_A) {
                    aHeld = true;
                    temp.setDx(-playerSpeed);
                }
                if (key == KeyEvent.VK_D) {
                    dHeld = true;
                    temp.setDx(playerSpeed);
                }
            }
            if (temp.getId() == GameObjectIDs.player2) {
                //key events related to player
                if (key == KeyEvent.VK_UP) {
                    upHeld = true;
                    if (upHeld && leftHeld) {
                        temp.setDy(-playerSpeed);
                        temp.setDx(-playerSpeed);
                    }
                    else if (upHeld && rightHeld) {
                        temp.setDy(-playerSpeed);
                        temp.setDx(playerSpeed);
                    }
                    else temp.setDy(-playerSpeed);
                }
                if (key == KeyEvent.VK_DOWN) {
                    downHeld = true;
                    if (downHeld && leftHeld) {
                        temp.setDy(playerSpeed);
                        temp.setDx(-playerSpeed);
                    }
                    else if (downHeld && rightHeld) {
                        temp.setDy(playerSpeed);
                        temp.setDx(playerSpeed);
                    }
                    else temp.setDy(playerSpeed);
                }
                if (key == KeyEvent.VK_LEFT) {
                    leftHeld = true;
                    temp.setDx(-playerSpeed);
                }
                if (key == KeyEvent.VK_RIGHT) {
                    rightHeld = true;
                    temp.setDx(playerSpeed);
                }
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        int key = e.getKeyCode();
        for (GameObject temp : gameHandler.objects) {
            if (temp.getId() == GameObjectIDs.player) {
                if (key == KeyEvent.VK_W) {
                    wHeld = false;
                    if (wHeld && aHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (wHeld && dHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (sHeld) temp.setDy(playerSpeed);
                    else temp.setDy(0);
                }
                if (key == KeyEvent.VK_S) {
                    sHeld = false;
                    if (sHeld && aHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (sHeld && dHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (wHeld) temp.setDy(-playerSpeed);
                    else temp.setDy(0);
                }
                if (key == KeyEvent.VK_A) {
                    aHeld = false;
                    if (dHeld) temp.setDx(playerSpeed);
                    else temp.setDx(0);
                }
                if (key == KeyEvent.VK_D) {
                    dHeld = false;
                    if (aHeld) temp.setDx(-playerSpeed);
                    else temp.setDx(0);
                }
            }
            if (temp.getId() == GameObjectIDs.player2) {
                if (key == KeyEvent.VK_UP) {
                    upHeld = false;
                    if (upHeld && leftHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (upHeld && rightHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (downHeld) temp.setDy(5);
                    else temp.setDy(0);
                }
                if (key == KeyEvent.VK_DOWN) {
                    downHeld = false;
                    if (downHeld && leftHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (downHeld && rightHeld) {
                        temp.setDy(0);
                        temp.setDx(0);
                    }
                    else if (upHeld) temp.setDy(-5);
                    else temp.setDy(0);
                }
                if (key == KeyEvent.VK_LEFT) {
                    leftHeld = false;
                    if (rightHeld) temp.setDx(5);
                    else temp.setDx(0);
                }
                if (key == KeyEvent.VK_RIGHT) {
                    rightHeld = false;
                    if (leftHeld) temp.setDx(-5);
                    else temp.setDx(0);
                }
            }
        }
    }
}
