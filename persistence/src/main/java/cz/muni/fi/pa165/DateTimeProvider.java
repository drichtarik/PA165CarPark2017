
package cz.muni.fi.pa165;

import java.time.LocalDateTime;


/**
 *
 * @author Martin Mi�keje
 */
public interface DateTimeProvider {
    LocalDateTime provideNow();
}
