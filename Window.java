package ui;

import javax.swing.*;
import java.awt.*;
import java.awt.Dimension;

/**
 * Created by kevin on 2016-09-12.
 */
public class Window extends JPanel {


    public Window(int width, int height, String title, Game game) {
        JFrame window = new JFrame(title);
        window.setMinimumSize(new Dimension(width, height));
        window.setMaximumSize(new Dimension(width, height));
        window.setPreferredSize(new Dimension(width, height));

        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setResizable(false);
        window.setLocationRelativeTo(null);
        window.add(game);
        window.setVisible(true);
        game.start();
    }
}
