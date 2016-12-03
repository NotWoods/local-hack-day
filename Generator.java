/**
 * Created by kevin on 2016-12-03.
 */
import java.util.Random;

public class Generator {
    private static char[] vowels = {
            'A', 'E', 'I', 'O', 'U'
    };
    private static char[] consonants = {
            'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'};

    public static String generateString() {
        String str = "";
        Random rand = new Random();
        int n = rand.nextInt(3 - 2 + 1) + 2;
        int v = rand.nextInt(5);
        int c = rand.nextInt(21);

        // pick 1 vovel and 1 constant.
        // append them together


        str += consonants[c];
        str +=vowels[v];
        if (n == 3) //print out 3 char string
        {
            str += consonants[rand.nextInt(21)];
        }
        return str;
    }
}
