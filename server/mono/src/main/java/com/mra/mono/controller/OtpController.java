package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.ChangePasswordRequest;
import com.mra.mono.dto.request.ChangePasswordRequestWithOtp;
import com.mra.mono.dto.response.AuthenticationResponse;
import com.mra.mono.service.EmailService;
import com.mra.mono.service.OtpService;
import com.mra.mono.service.UserService;
import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OtpController extends BaseController {

    @Resource
    private OtpService otpService;

    @Resource
    private EmailService emailService;

    @Resource
    private UserService userService;

    @PostMapping("/sendOtp")
    public ResponseEntity<Message<String>> sendOtp(@RequestParam String email) {

        String otp = otpService.generateOtp(email);
        String resetUrl = "https://management.philofoody.com/auth/forgot-password/" + otp;


        String htmlContent = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n" +
                "        \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html dir=\"ltr\" lang=\"en\">\n" +
                "<head>\n" +
                "    <meta content=\"text/html; charset=UTF-8\" http-equiv=\"Content-Type\"/>\n" +
                "</head>\n" +
                "<div style=\"display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0\">PhiloFoody şifreni\n" +
                "    yenileyecek misin?\n" +
                "    <div>\n" +
                "         \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF \u200C\u200B\u200D\u200E\u200F\uFEFF\n" +
                "    </div>\n" +
                "</div>\n" +
                "<body style=\"background-color:#f6f9fc;padding:10px 0\">\n" +
                "<table align=\"center\" width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" role=\"presentation\"\n" +
                "       style=\"max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px\">\n" +
                "    <tbody>\n" +
                "    <tr style=\"width:100%\">\n" +
                "        <td><img alt=\"Dropbox\" height=\"33\"\n" +
                "                 src=\"https://react-email-demo-7s5r0trkn-resend.vercel.app/static/dropbox-logo.png\"\n" +
                "                 style=\"display:block;outline:none;border:none;text-decoration:none\" width=\"40\"/>\n" +
                "            <table align=\"center\" width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" role=\"presentation\">\n" +
                "                <tbody>\n" +
                "                <tr>\n" +
                "                    <td>\n" +
                "                        <p style=\"font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040\">\n" +
                "                            Merhaba Philo Ailesinin değerli üyesi,</p>\n" +
                "                        <p style=\"font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040\">\n" +
                "                            Birisi yakın zamanda Philofoody hesabınız için şifre değişikliği talebinde bulundu. Eğer bu\n" +
                "                            talebi gönderen sensen,\n" +
                "                            buradan yeni bir şifre belirleyebilirsiniz:</p><a href=\"" + resetUrl + "\"\n" +
                "                                                                              style=\"background-color:#4B0082;border-radius:4px;color:#fff;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:14px 7px 14px 7px;line-height:100%;max-width:100%\"\n" +
                "                                                                              target=\"_blank\"><span><!--[if mso]><i style=\"letter-spacing: 7px;mso-font-width:-100%;mso-text-raise:21\" hidden>&nbsp;</i><![endif]--></span><span\n" +
                "                            style=\"max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px\">Şifreyi yenile</span><span><!--[if mso]><i style=\"letter-spacing: 7px;mso-font-width:-100%\" hidden>&nbsp;</i><![endif]--></span></a>\n" +
                "                        <p style=\"font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040\">\n" +
                "                            Şifrenizi değiştirmek istemiyorsanız veya bunu talep etmediyseniz bu mesajı dikkate almayın\n" +
                "                            ve silin.</p>\n" +
                "                        <p style=\"font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040\">\n" +
                "                            Hesabınızı güvende tutmak için lütfen bu e-postayı kimseye iletmeyin.<!-- --> <a href=\"https://philofoody.com/tips\"\n" +
                "                                                  style=\"color:#067df7;text-decoration:underline\" target=\"_blank\">daha fazla güvenlik önerisi.</a></p>\n" +
                "                        <p style=\"font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040\">\n" +
                "                            Foody'lemeye devam edin :)</p></td>\n" +
                "                </tr>\n" +
                "                </tbody>\n" +
                "            </table>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "    </tbody>\n" +
                "</table>\n" +
                "</body>\n" +
                "</html>\n";
        try {
            emailService.sendHtmlMessage(email, "Şifre yenileme talebi PhiloFoody", htmlContent);
        } catch (MessagingException e) {
            e.printStackTrace();
            return buildFailureReturnEntity("Mail gönderilemedi");
        }
        return buildSuccessReturnEntity("Mail gönderildi");
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<Message<String>> verifyOtp(@RequestBody ChangePasswordRequestWithOtp request) {

        if (otpService.validateOtp(request.getEmail(), request.getOtp())) {
            userService.changePassword(request);
            return buildSuccessReturnEntity("Mail gönderildi");
        } else {
            return buildFailureReturnEntity("gecersiz link");
        }
    }
}
