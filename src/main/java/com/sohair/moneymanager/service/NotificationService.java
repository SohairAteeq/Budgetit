package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.ExpenseDTO;
import com.sohair.moneymanager.dto.ProfileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Repository
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    @Value("${app.frontend.url}")
    private String frontendUrl = "http://localhost:5173";

    private final ProfileService profileService;
    private final EmailService emailService;
    private final ExpenseService expenseService;

//    @Scheduled(cron = "0 * * * * *")
//    @Scheduled(cron = "0 0 22 * * *")
    public void sendNotification(){
        List<ProfileDTO> profiles = profileService.getAllProfiles();

        for(ProfileDTO profile : profiles){
            String emailBody = """
                <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Hello %s 👋</h2>
                    <p>This is your friendly reminder from <b>MoneyManager</b> to add today’s income and expenses.</p>
                    <p>Keeping track of your daily transactions helps you stay on top of your budget goals.</p>
                    <a href="%s" style="background-color:#4CAF50;color:white;
                       padding:20px 20px;text-decoration:none;border-radius:5px;">
                       Log Today’s Transactions
                    </a>
                    <br/><br/>
                    <p style="font-size:12px; color:#777;">You’re receiving this email because you are registered with MoneyManager.</p>
                  </body>
                </html>
                """.formatted(profile.getFullName(), frontendUrl);

            emailService.sendEmail(profile.getEmail(), "Daily Reminder: Log Your Income and Expenses", emailBody);
            log.info("Notification email sent to {}", profile.getEmail());
        }
    }


//    @Scheduled(cron = "0 * * * * *")
    public void sendDailyExpenseSummary() {
        List<ProfileDTO> profiles = profileService.getAllProfiles();

        for (ProfileDTO profile : profiles) {
            List<ExpenseDTO> todayExpenses =
                    expenseService.getExpensesFromUserOnDate(profile.getId(), LocalDate.now());
            log.info(todayExpenses + " for " + profile.getEmail());

            if (todayExpenses.isEmpty()) {
                log.info("No expenses recorded today for {}", profile.getEmail());
                continue;
            }

            // Build the expenses table rows
            StringBuilder expenseListHtml = new StringBuilder();
            for (ExpenseDTO expense : todayExpenses) {
                expenseListHtml.append("""
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$%.2f</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                </tr>
                """.formatted(
                        expense.getName(),
                        expense.getAmount(),
                        expense.getCategoryId()
                ));
            }

            // Format the email body
            String emailBody = """
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Daily Expense Summary for %s</h2>
                <p>Here are your expenses recorded today:</p>
                <table style="border-collapse: collapse; width: 100%%;">
                  <thead>
                    <tr>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Name</th>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Amount</th>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    %s
                  </tbody>
                </table>
                <br/>
                <a href="%s" style="background-color:#4CAF50;color:white;
                   padding:10px 15px;text-decoration:none;border-radius:5px;">
                   View All Transactions
                </a>
                <br/><br/>
                <p style="font-size:12px; color:#777;">You’re receiving this email because you are registered with MoneyManager.</p>
              </body>
            </html>
            """.formatted(
                    profile.getFullName(),                       // First %s → user’s name
                    expenseListHtml.toString(),              // Second %s → expense rows
                    "https://moneymanager.com/transactions"  // Third %s → link
            );

            // Send the email
            emailService.sendEmail(
                    profile.getEmail(),
                    "Your Daily Expense Summary - " + LocalDate.now(),
                    emailBody
            );

            log.info("Sent daily expense summary to {}", profile.getEmail());
        }
    }


}
