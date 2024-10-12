export async function sendCustomVerificationRequest({ identifier: to, provider, url }: { identifier: string; provider: any; url: string }) {
    const host = new URL(url).host;
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: provider.from,
            to,
            subject: `Iniciar sesión en ${host}`,
            html: html({ url, host }), // Use your custom HTML function
            text: text({ url, host }), // Use your custom text function
        }),
    });

    if (!res.ok) {
        throw new Error("Resend error: " + JSON.stringify(await res.json()));
    }
}

function html(params: { url: string; host: string }) {
    const { url, host } = params;
    const escapedHost = host.replace(/\./g, "&#8203;.");
    return `
    <body style="margin: 0; padding: 16px; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding: 0;">
                    <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 16px;">
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 0; padding: 0;">
                                    Inicia sesión en ${escapedHost}
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 16px;">
                                <a href="${url}" target="_blank" style="text-decoration: none; color: #fff; background-color: #5883e1; font-weight: 600; padding: 16px; border-radius: 8px; display: inline-block; width: 90%; max-width: 540px; text-align: center;">
                                    Iniciar sesión
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; text-align: center; padding: 16px;">
                                Si no solicitaste este correo electrónico, puedes ignorarlo con seguridad.
                            </td>
                        </tr>
                        <tr>
                            <tr style="font-size: 9px; text-align: center; padding: 16px;">
                                Si tienes problemas para hacer clic en el botón "Iniciar sesión", copia y pega la siguiente URL en tu navegador:
                            </tr>
                            <tr style="font-size: 9px; text-align: center; padding: 16px;">
                                ${url}
                            </tr>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
    return `Inicie sesíon en ${host}\n${url}\n\n`;
}
