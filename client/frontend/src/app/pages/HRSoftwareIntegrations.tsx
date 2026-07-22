import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";

export function HRSoftwareIntegrations({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const t = getPageTheme(isDarkMode);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, fontFamily: "'Wix Madefor Display', sans-serif" }}>
      <div style={{ flex: 1, padding: "16px 20px", background: t.contentBg, overflowY: "auto" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 500, color: t.title, marginBottom: "14px" }}>
          HR Software Integrations
        </h1>

        <div style={{ background: t.cardBg, border: t.cardBorder, borderRadius: "4px", padding: "24px", boxShadow: t.cardShadow, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: t.textSecondary, lineHeight: "1.6" }}>
            <p style={{ margin: 0 }}>
              When a new account is set up in our system and we create a package, our system generates a link that is specific to the searches in that package, and to the user. These links can be found below.
            </p>
            <p style={{ margin: 0 }}>
              We then include this link in an email message and share this email message with our client. The message includes a link to the Fair Credit Reporting Act Summary of Rights, some instructions on how to enter the required information to process their background check and some instructions on what to do if the candidate receives an Adverse Action notice.
            </p>
            <p style={{ margin: 0 }}>
              Using the email templates in your recruiting software, ATS, HRIS or onboarding system, you can create a custom email message with this language that you will send to your candidate when you are ready to initiate a background check.
            </p>
            <p style={{ margin: 0 }}>
              The candidate will open the email message and click a link, which opens a screen in their browser. The first thing they will see is their Disclosure and Authroization Form. They will read this form, enter the required information to process their background check and electronically sign their authorization form.
            </p>
            <p style={{ margin: 0 }}>
              Once the candidate submits this information, our system will send an email message to the user, informing them that the candidate has completed this step and then a completed report will be emailed to the user a couple days later. This works inside every HR software platform.
            </p>
          </div>

          <div style={{ overflowX: "auto", marginTop: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: t.tableHeadBg, borderBottom: t.tableHeadBorder }}>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: t.label, width: "50%" }}>
                    Package Name
                  </th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: t.label, width: "50%" }}>
                    URL
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2} style={{ padding: "16px", fontSize: "13px", color: t.textSecondary, borderBottom: t.tableRowBorder }}>
                    There are no packages setup for your account. Please contact support.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
