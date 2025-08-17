import { formatDate } from "./date";

export const defaultHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px; letter-spacing: 0.25px; background-color: #FFFFFF;">
    <center style="margin: 0; padding: 0; width: 100%; table-layout: fixed; padding-bottom: 60px;">
      <table style="margin: 0 auto; padding: 16px 0 0 0; border-spacing: 0; width: 100%; max-width: 600px; color: #333; background-color: #005250;">
        <tr>
            <td style="background-color: #005250; color: #ffffff; padding: 16px; text-align: center;">
                <a href="https://staybook.in" style="color: #FFFFFF; text-decoration: none;">
                    <img
                        src="https://images.staybook.in/logo%20(1).png"
                        alt="brand_logo"
                        width="60"
                        height="60"
                    />
                </a>
                <h2 style="margin-top: 8px">Hello World!</h2>
            </td>
        </tr>
      </table>
    </center>
</body>
</html>`;

export const getSummaryEmail = (
  completedAt: string,
  total: number,
  success: number,
  failed: number,
  actionLink: string,
) => {
  const date = formatDate(completedAt);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Campaign Summary Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 14px; letter-spacing: 0.25px; background-color: #FFFFFF;">
        <center style="margin: 0; padding: 0; width: 100%; table-layout: fixed; padding-bottom: 60px;">
        <table style="margin: 0 auto; padding: 16px 0 0 0; border-spacing: 0; width: 100%; max-width: 600px; color: #ffffff;">
            <tr>
                <td style="background-color: #181818; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
                        SMTPilot
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 16px;">
                        Email Delivery Service
                    </p>
                </td>
            </tr>

            <!-- Success Icon & Title -->
            <tr>
                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                    <div style="width: 60px; height: 60px; background-color: #181818; border-radius: 50%; margin: 0 auto 20px auto; display: inline-block; text-align: center; line-height: 60px;">
                        <span style="color: #ffffff; font-size: 24px; font-weight: bold;">✓</span>
                    </div>
                    <h2 style="color: #181818; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                        Email Campaign Completed
                    </h2>
                    <p style="color: #242000; margin: 0; font-size: 16px;">
                        Your email campaign has finished processing
                    </p>
                </td>
            </tr>

            <!-- Campaign Details -->
            <tr>
                <td style="padding: 0 30px 30px 30px;">
                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #f9fafb; border-radius: 8px; padding: 20px;"
                    >
                        <tr>
                            <td>
                                <h3 style="color: #181818; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                                    Campaign Details
                                </h3>
                                <p style="color: #242000;">Completed on ${date}</p>

                                <!-- Statistics -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                >
                                    <tr>
                                        <td width="33%" style="text-align: center; padding: 15px; border-radius: 6px; margin-right: 10px;">
                                            <div style="color: #181818; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
                                                ${total}
                                            </div>
                                            <div style="color: #6b7280; font-size: 12px;">
                                                Total Emails
                                            </div>
                                        </td>
                                        <td width="33%" style="text-align: center; padding: 15px; border-radius: 6px; margin: 0 5px;">
                                            <div style="color: #10b981; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
                                                ${success}
                                            </div>
                                            <div style="color: #6b7280; font-size: 12px;">
                                                Delivered
                                            </div>
                                        </td>
                                        <td width="33%" style="text-align: center; padding: 15px; border-radius: 6px; margin-left: 10px;">
                                            <div style="color: #ef4444; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
                                                ${failed}
                                            </div>
                                            <div style="color: #6b7280; font-size: 12px;">
                                                Failed
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Call to Action -->
            <tr>
                <td style="padding: 0 30px 40px 30px; text-align: center;">
                    <a
                        href="${actionLink}"
                        style="display: inline-block; background-color: #181818; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-size: 16px; font-weight: bold; margin-bottom: 15px;"
                    >
                        View Detailed Report
                    </a>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">
                        Click above to view delivery details and campaign analytics
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #181818; padding: 30px; text-align: center;">
                    <p style=" margin: 0 0 10px 0; font-size: 14px;">
                        This notification was sent by the SMTPilot Team
                    </p>
                    <p style="margin: 0; font-size: 12px;">
                        Need help? Contact us at
                        <a href="mailto:mk.mohit2440@gmail.com" style="color: #2563eb; text-decoration: none;">
                            smtpilot
                        </a>
                    </p>
                </td>
            </tr>
        </table>
        </center>
    </body>
    </html>`;
};
