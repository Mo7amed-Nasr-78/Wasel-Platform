export function EmailTemplate(user, type, data?) {
    switch (type) {
        case "welcoming": 
            return (
                `
                <!DOCTYPE html>
                <html lang="ar" dir="rtl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="color-scheme" content="light" />
                <meta name="supported-color-schemes" content="light" />
                <title>أهلاً بك في وصل</title>
                <!--[if mso]>
                <noscript>
                <xml>
                <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                </noscript>
                <style>
                    table, td, div, h1, p { font-family: Tahoma, Arial, sans-serif !important; }
                </style>
                <![endif]-->
                <style>
                    /* Client resets */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
                    img { -ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; display: block; }
                    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
                    a { text-decoration: none; }
    
                    /* Responsive */
                    @media screen and (max-width: 600px) {
                        .wsl-container { width: 100% !important; max-width: 100% !important; }
                        .wsl-px { padding-left: 20px !important; padding-right: 20px !important; }
                        .wsl-py { padding-top: 28px !important; padding-bottom: 28px !important; }
                        .wsl-h1 { font-size: 24px !important; line-height: 32px !important; }
                        .wsl-stack { display: block !important; width: 100% !important; }
                        .wsl-btn a { display: block !important; width: 100% !important; }
                    }
                </style>
                </head>
                <body style="margin:0; padding:0; background-color:#EEF2FB; font-family:'Tajawal', Tahoma, Arial, sans-serif;">
    
                    <!-- Preheader (hidden preview text shown in inbox list) -->
                    <div style="display:none; max-height:0px; max-width:0px; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:#EEF2FB;">
                        أهلاً بيك في وصل! حسابك جاهز دلوقتي، ابدأ أول عملية شحن أو انضم كناقل في دقايق.
                        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
                    </div>
    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EEF2FB;">
                        <tr>
                            <td align="center" style="padding:32px 16px;">
    
                                <table role="presentation" class="wsl-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:20px; overflow:hidden;">
    
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" style="background-color:#2451B3; padding:36px 24px;">
                                            <span style="font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:30px; font-weight:800; color:#FFFFFF; letter-spacing:1px;">وصل</span>
                                            <div style="font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:13px; font-weight:400; color:rgba(255,255,255,0.75); margin-top:6px;">
                                                منصّة نقل الحمولات
                                            </div>
                                        </td>
                                    </tr>
    
                                    <!-- Success icon + welcome -->
                                    <tr>
                                        <td align="center" class="wsl-px wsl-py" style="padding:44px 40px 8px;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="64" height="64" style="width:64px; height:64px; background-color:#E9EFFC; border-radius:50%;">
                                                <tr>
                                                    <td align="center" valign="middle" style="font-size:28px; line-height:64px; color:#2451B3; font-weight:700;">✓</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td align="center" class="wsl-px" style="padding:16px 40px 0;">
                                            <h1 class="wsl-h1" style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:28px; line-height:36px; font-weight:800; color:#151E33;">
                                                أهلاً بيك في وصل، ${user.first_name & user.lastName? user.first_name + " " + user.lastName : user.username} 👋
                                            </h1>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td align="center" class="wsl-px" style="padding:16px 40px 0;">
                                            <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:16px; line-height:28px; font-weight:400; color:#6B7385;">
                                                حسابك اتعمل بنجاح، وإحنا سعداء إنك انضممت لينا. سواء كنت صاحب حمولة بتدور على أفضل عروض الشحن، أو ناقل بتدور تزود دخلك، دلوقتي معاك كل الأدوات اللي محتاجها في مكان واحد.
                                            </p>
                                        </td>
                                    </tr>
    
                                    <!-- CTA button (bulletproof) -->
                                    <tr>
                                        <td align="center" class="wsl-px" style="padding:32px 40px 8px;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="wsl-btn">
                                                <tr>
                                                    <td align="center" style="border-radius:14px; background-color:#2451B3;">
                                                        <a href={${process.env.FRONTEND_URL}profile/${user.username}} target="_blank" style="display:inline-block; padding:16px 44px; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:16px; font-weight:700; color:#FFFFFF; border-radius:14px;">
                                                            أكمل بيانات حسابك
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td align="center" class="wsl-px" style="padding:8px 40px 36px;">
                                            <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:13px; line-height:20px; color:#9AA1B2;">
                                                بياخد أقل من دقيقتين، ويخليك جاهز تبدأ فورًا.
                                            </p>
                                        </td>
                                    </tr>
    
                                    <!-- Divider -->
                                    <tr>
                                        <td class="wsl-px" style="padding:0 40px;">
                                            <div style="border-top:1px solid #EDEFF5;"></div>
                                        </td>
                                    </tr>
    
                                    <!-- Next steps -->
                                    <tr>
                                        <td class="wsl-px" style="padding:36px 40px 8px;">
                                            <p style="margin:0 0 24px; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:15px; font-weight:800; color:#151E33; text-align:right;">
                                                إيه الخطوات الجاية؟
                                            </p>
    
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                                                <tr>
                                                    <td width="40" valign="top" align="center" style="padding-top:2px;">
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="28" height="28" style="width:28px; height:28px; background-color:#2451B3; border-radius:50%;">
                                                            <tr><td align="center" valign="middle" style="font-family:Tahoma, Arial, sans-serif; font-size:13px; font-weight:700; color:#FFFFFF; line-height:28px;">1</td></tr>
                                                        </table>
                                                    </td>
                                                    <td width="12"></td>
                                                    <td valign="top" align="right">
                                                        <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:15px; font-weight:700; color:#151E33;">استكمل ملفك الشخصي</p>
                                                        <p style="margin:4px 0 0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:14px; line-height:22px; color:#6B7385;">أضف بيانات التواصل وتفاصيل نشاطك عشان نوصلك بأفضل العروض.</p>
                                                    </td>
                                                </tr>
                                            </table>
    
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                                                <tr>
                                                    <td width="40" valign="top" align="center" style="padding-top:2px;">
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="28" height="28" style="width:28px; height:28px; background-color:#2451B3; border-radius:50%;">
                                                            <tr><td align="center" valign="middle" style="font-family:Tahoma, Arial, sans-serif; font-size:13px; font-weight:700; color:#FFFFFF; line-height:28px;">2</td></tr>
                                                        </table>
                                                    </td>
                                                    <td width="12"></td>
                                                    <td valign="top" align="right">
                                                        <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:15px; font-weight:700; color:#151E33;">ارفع حمولتك أو تصفّح العروض</p>
                                                        <p style="margin:4px 0 0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:14px; line-height:22px; color:#6B7385;">صاحب حمولة؟ انشر تفاصيلها. ناقل؟ تصفّح الحمولات المتاحة دلوقتي.</p>
                                                    </td>
                                                </tr>
                                            </table>
    
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
                                                <tr>
                                                    <td width="40" valign="top" align="center" style="padding-top:2px;">
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="28" height="28" style="width:28px; height:28px; background-color:#2451B3; border-radius:50%;">
                                                            <tr><td align="center" valign="middle" style="font-family:Tahoma, Arial, sans-serif; font-size:13px; font-weight:700; color:#FFFFFF; line-height:28px;">3</td></tr>
                                                        </table>
                                                    </td>
                                                    <td width="12"></td>
                                                    <td valign="top" align="right">
                                                        <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:15px; font-weight:700; color:#151E33;">تابع شحنتك أول بأول</p>
                                                        <p style="margin:4px 0 0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:14px; line-height:22px; color:#6B7385;">من لحظة الاتفاق مع الناقل وحتى وصول الحمولة، كل حاجة قدامك بشفافية.</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <!-- Support banner -->
                                    <tr>
                                        <td class="wsl-px" style="padding:12px 40px 40px;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EEF2FB; border-radius:16px;">
                                                <tr>
                                                    <td align="center" style="padding:22px 24px;">
                                                        <p style="margin:0 0 4px; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:14px; font-weight:700; color:#151E33;">محتاج مساعدة؟</p>
                                                        <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:14px; line-height:22px; color:#6B7385;">
                                                            فريق الدعم جاهز يرد عليك على
                                                            <a href="mailto:support@wasel.com" style="color:#2451B3; font-weight:700;">support@wasel.com</a>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
    
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="background-color:#F7F9FD; padding:28px 40px;">
                                            <p style="margin:0 0 10px; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:13px; color:#9AA1B2;">
                                                تابعنا:
                                                <a href="#" style="color:#2451B3; font-weight:600; margin:0 4px;">فيسبوك</a> ·
                                                <a href="#" style="color:#2451B3; font-weight:600; margin:0 4px;">إنستجرام</a> ·
                                                <a href="#" style="color:#2451B3; font-weight:600; margin:0 4px;">واتساب</a>
                                            </p>
                                            <p style="margin:0 0 6px; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:12px; color:#B1B6C4;">
                                                وصلتك الرسالة دي لأنك عملت حساب جديد على منصة وصل.
                                            </p>
                                            <p style="margin:0; font-family:'Tajawal', Tahoma, Arial, sans-serif; font-size:12px; color:#B1B6C4;">
                                                © {{current_year}} وصل. جميع الحقوق محفوظة. ·
                                                <a href="{{preferences_url}}" style="color:#9AA1B2; text-decoration:underline;">إعدادات الإشعارات</a>
                                            </p>
                                        </td>
                                    </tr>
    
                                </table>
                                <!-- /Container -->
    
                            </td>
                        </tr>
                    </table>
    
                </body>
                </html>
                `
            )
        case 'otp':
            return (`
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Verification Code</h2>
                    <p style="color: #666; font-size: 16px;">Hello, ${user.profile.first_name?.concat(user.profile.last_name) ? user.profile.first_name + user.profile.last_name : 'There'}</p>
                    <p style="color: #666; font-size: 16px;">Your verification code is:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
                    ${data.newOtp}
                    </div>
                    <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes.</p>
                    <p style="color: #666; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
                    <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">This is an automated email, please do not reply.</p>
                </div>
                `)
        default:
            return "Unknown!";
    }
}
