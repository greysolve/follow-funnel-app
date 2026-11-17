import { useNavigate } from 'react-router-dom';
import { Video, ArrowLeft } from 'lucide-react';

export default function Dpa() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">FollowFunnel</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Processing Addendum</h1>
        <p className="text-gray-600 mb-8">Version 1. Effective November 17, 2026</p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            This Data Processing Addendum ("DPA") supplements and forms part of the FollowFunnel Terms of Service at{' '}
            <a href="https://www.followfunnel.app/terms" className="text-blue-600 hover:underline">https://www.followfunnel.app/terms</a>
            , or any other agreement between the Customer and FollowFunnel covering the Services (the "Agreement").
          </p>
          <p className="text-gray-700 mb-8">
            By accepting the Agreement, the Customer accepts this DPA. Accepting this DPA has the same effect as signing the Standard Contractual Clauses incorporated in Section 12. If this DPA and the Agreement conflict on the processing of Personal Data, this DPA prevails.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Parties</h2>
            <p className="text-gray-700 mb-4">
              <strong>FollowFunnel</strong> means IA Lonestar Tech Consulting, a Texas limited liability company doing business as Greysolve Consulting, of 2591 Dallas Parkway STE 300-179, Frisco, TX 75034, USA.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Customer</strong> means the entity or individual that has accepted the Agreement and uses the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Definitions</h2>
            <p className="text-gray-700 mb-4">
              Capitalized terms not defined here have the meanings given in the Agreement. "Controller," "Processor," "Data Subject," "Personal Data," "Processing" and "Supervisory Authority" have the meanings given in the GDPR.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Applicable Data Protection Laws"</strong> means all laws on the privacy or protection of Personal Data that apply to the Processing under the Agreement. This includes the EU GDPR, the UK GDPR, the UK Data Protection Act 2018, the Swiss Federal Act on Data Protection, and US state privacy laws such as the CCPA, each as amended or replaced.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Customer Data"</strong> means Personal Data that FollowFunnel Processes on the Customer's behalf in providing the Services, as described in Schedule 1.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"GDPR"</strong> means Regulation (EU) 2016/679 (the "EU GDPR") and, where applicable, the "UK GDPR" as defined in section 3 of the UK Data Protection Act 2018.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Security Incident"</strong> means a confirmed breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, Customer Data. It does not include unsuccessful attempts or activities that do not compromise the security of Customer Data, such as pings, port scans, failed login attempts or denial-of-service attacks.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Services"</strong> means the FollowFunnel application, which retrieves meeting attendee and registrant data from the Customer's connected Zoom account and sends follow-up emails through the Customer's connected email account.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Standard Contractual Clauses"</strong> or <strong>"SCCs"</strong> means the standard contractual clauses annexed to Commission Implementing Decision (EU) 2021/914 of 4 June 2021.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>"Sub-processor"</strong> means a third party that FollowFunnel engages to Process Customer Data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Roles of the Parties</h2>
            <p className="text-gray-700 mb-4">
              2.1 For Customer Data, the Customer is the Controller (or a Processor acting for its own Controller), and FollowFunnel is the Processor (or a Sub-processor).
            </p>
            <p className="text-gray-700 mb-4">
              2.2 Where the Customer acts as a Processor for a third-party Controller, the Customer warrants that the Controller has authorized its instructions, including the appointment of FollowFunnel.
            </p>
            <p className="text-gray-700 mb-4">
              2.3 FollowFunnel is an independent Controller of the account, billing and support data of the Customer's own users. That data is covered by the FollowFunnel Privacy Policy at{' '}
              <a href="https://www.followfunnel.app/privacy" className="text-blue-600 hover:underline">https://www.followfunnel.app/privacy</a>
              , not by this DPA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Processing Instructions</h2>
            <p className="text-gray-700 mb-4">
              3.1 FollowFunnel will Process Customer Data only on the Customer's documented instructions. The Agreement, this DPA, and the Customer's configuration and use of the Services together form those instructions. These include selecting meetings, writing templates and setting send schedules. FollowFunnel may Process Customer Data otherwise only where required by law. In that case, FollowFunnel will inform the Customer before Processing, unless the law prohibits it.
            </p>
            <p className="text-gray-700 mb-4">
              3.2 FollowFunnel will promptly inform the Customer if, in its opinion, an instruction infringes Applicable Data Protection Laws.
            </p>
            <p className="text-gray-700 mb-4">3.3 FollowFunnel will not:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>sell or share Customer Data, or make it available to any third party for monetary or other valuable consideration;</li>
              <li>use Customer Data for cross-context behavioral advertising;</li>
              <li>retain, use or disclose Customer Data for any purpose other than providing the Services;</li>
              <li>combine Customer Data with Personal Data from other sources, except as Applicable Data Protection Laws permit; or</li>
              <li>use Customer Data, or data received through Google APIs, to develop, improve or train generalized artificial intelligence or machine learning models.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              3.4 FollowFunnel's use of data received from Google APIs complies with the Google API Services User Data Policy, including its Limited Use requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Customer Obligations</h2>
            <p className="text-gray-700 mb-4">The Customer is responsible for:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>having a lawful basis under Applicable Data Protection Laws for the Customer Data it directs FollowFunnel to Process, and for sending follow-up emails to its meeting attendees and registrants;</li>
              <li>giving Data Subjects all notices required by Applicable Data Protection Laws, and by applicable email marketing laws (such as the ePrivacy Directive and national rules on unsolicited electronic communications);</li>
              <li>honoring unsubscribe and objection requests from recipients of emails sent through the Services; and</li>
              <li>not using the Services to Process special categories of Personal Data (GDPR Article 9) or data relating to criminal convictions.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Confidentiality and Personnel</h2>
            <p className="text-gray-700 mb-4">
              FollowFunnel will limit access to Customer Data to personnel who need it to provide the Services. All such personnel are bound by confidentiality obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Security</h2>
            <p className="text-gray-700 mb-4">
              6.1 FollowFunnel will maintain the technical and organizational measures described in Schedule 2. These measures are designed to protect Customer Data against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.
            </p>
            <p className="text-gray-700 mb-4">
              6.2 FollowFunnel may update these measures from time to time, provided that the overall level of security does not decrease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Sub-processors</h2>
            <p className="text-gray-700 mb-4">
              7.1 <strong>General authorization.</strong> The Customer gives FollowFunnel general authorization to engage the Sub-processors listed in Schedule 3.
            </p>
            <p className="text-gray-700 mb-4">
              7.2 <strong>Sub-processor terms.</strong> FollowFunnel will enter into a written agreement with each Sub-processor that imposes data protection obligations no less protective than those in this DPA. FollowFunnel remains liable for each Sub-processor's performance of those obligations.
            </p>
            <p className="text-gray-700 mb-4">
              7.3 <strong>Changes.</strong> FollowFunnel will notify the Customer of any intended addition or replacement of a Sub-processor at least 30 days in advance. Notice will be sent by email to the Customer's account email address, and the change will be shown on the list at{' '}
              <a href="https://www.followfunnel.app/dpa#subprocessors" className="text-blue-600 hover:underline">https://www.followfunnel.app/dpa#subprocessors</a>.
            </p>
            <p className="text-gray-700 mb-4">
              7.4 <strong>Objections.</strong> The Customer may object on reasonable data protection grounds by giving written notice to{' '}
              <a href="mailto:privacy@followfunnel.app" className="text-blue-600 hover:underline">privacy@followfunnel.app</a>
              {' '}within 15 days of the notice. The parties will work in good faith to resolve the objection. If they cannot resolve it within 30 days, the Customer may terminate the affected Services and receive a refund of any prepaid, unused fees for those Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Subject Requests</h2>
            <p className="text-gray-700 mb-4">
              8.1 FollowFunnel will promptly notify the Customer of any request from a Data Subject to exercise their rights that FollowFunnel receives and can associate with the Customer. FollowFunnel will not respond to the request itself, except to tell the Data Subject that the request has been forwarded to the Customer.
            </p>
            <p className="text-gray-700 mb-4">
              8.2 The Services let the Customer delete its account and associated Customer Data on a self-service basis. Taking into account the nature of the Processing, FollowFunnel will provide reasonable further help with Data Subject requests that the Customer cannot fulfill through the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Security Incidents</h2>
            <p className="text-gray-700 mb-4">
              9.1 FollowFunnel will notify the Customer without undue delay, and where feasible within 48 hours, after becoming aware of a Security Incident affecting Customer Data. Notice will be sent to the Customer's account email address.
            </p>
            <p className="text-gray-700 mb-4">9.2 The notice will include, as far as is then known:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>the nature of the incident;</li>
              <li>the categories and approximate number of Data Subjects and records affected;</li>
              <li>the likely consequences; and</li>
              <li>the measures taken or proposed.</li>
            </ul>
            <p className="text-gray-700 mb-4">FollowFunnel will provide further information as it becomes available.</p>
            <p className="text-gray-700 mb-4">
              9.3 FollowFunnel will take reasonable steps to contain and mitigate the Security Incident. It will also help the Customer meet its obligations to notify Supervisory Authorities and Data Subjects.
            </p>
            <p className="text-gray-700 mb-4">
              9.4 Notifying or responding to a Security Incident is not an acknowledgment of fault or liability by FollowFunnel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Assessments, Audits and Information</h2>
            <p className="text-gray-700 mb-4">
              10.1 FollowFunnel will provide information reasonably needed to demonstrate its compliance with this DPA. It will also give reasonable help with any data protection impact assessment or prior consultation the Customer is required to carry out.
            </p>
            <p className="text-gray-700 mb-4">
              10.2 If that information does not reasonably satisfy the Customer's obligations under Applicable Data Protection Laws, the Customer may audit FollowFunnel's compliance, subject to the following:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>no more than once a year, unless a Supervisory Authority requires otherwise or a Security Incident has occurred;</li>
              <li>at least 30 days' written notice;</li>
              <li>during normal business hours;</li>
              <li>under reasonable confidentiality obligations; and</li>
              <li>at the Customer's expense.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              10.3 Audits of FollowFunnel's Sub-processors will be satisfied through the audit reports and certifications those Sub-processors make available.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Return and Deletion</h2>
            <p className="text-gray-700 mb-4">
              11.1 During the term, the Customer can delete Customer Data, or its entire account, at any time through the Services.
            </p>
            <p className="text-gray-700 mb-4">
              11.2 When the Agreement ends, FollowFunnel will delete Customer Data within 30 days, unless law requires it to be retained. Backups are overwritten in the ordinary course within 30 days after that. Before the Agreement ends, the Customer may request a copy of its Customer Data in a commonly used format.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. International Transfers</h2>
            <p className="text-gray-700 mb-4">
              12.1 <strong>Location of Processing.</strong> FollowFunnel is established in the United States. Customer Data may be Processed in the United States, the EU and Singapore, as described in Schedule 3.
            </p>
            <p className="text-gray-700 mb-4">
              12.2 <strong>EU SCCs.</strong> Where the GDPR applies to a transfer of Customer Data to FollowFunnel in a country without an adequacy decision, the SCCs are incorporated into this DPA as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Module Two (controller to processor) applies where the Customer is a Controller. Module Three (processor to processor) applies where the Customer is a Processor.</li>
              <li>Clause 7 (docking clause) does not apply.</li>
              <li>In Clause 9(a), Option 2 (general written authorization) applies, with the notice period set out in Section 7.3.</li>
              <li>In Clause 11(a), the optional language does not apply.</li>
              <li>In Clause 17, Option 1 applies, and the SCCs are governed by the laws of Ireland.</li>
              <li>In Clause 18(b), disputes are resolved before the courts of Ireland.</li>
              <li>Annex I is completed by Schedule 1, Annex II by Schedule 2, and Annex III by Schedule 3.</li>
              <li>For Annex I.C, the competent Supervisory Authority is the one in the EU Member State where the Customer is established. If the Customer is not established in the EU, it is the Data Protection Commission of Ireland.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              12.3 <strong>UK.</strong> For transfers subject to the UK GDPR, the International Data Transfer Addendum to the EU SCCs (version B1.0, issued by the UK Information Commissioner) applies. Table 1 is completed by the Parties section and Schedule 1. Tables 2 and 3 are completed by Section 12.2 and Schedules 1 to 3. For Table 4, either party may end the Addendum as set out in its Section 19.
            </p>
            <p className="text-gray-700 mb-4">
              12.4 <strong>Switzerland.</strong> For transfers subject to Swiss data protection law, the SCCs apply with the following changes: references to the GDPR are read as references to the Swiss Federal Act on Data Protection; the competent Supervisory Authority is the Swiss Federal Data Protection and Information Commissioner; and the term "Member State" does not exclude Data Subjects in Switzerland from suing for their rights where they habitually reside.
            </p>
            <p className="text-gray-700 mb-4">
              12.5 <strong>Alternative mechanism.</strong> If FollowFunnel adopts another valid transfer mechanism, such as certification under the EU-U.S. Data Privacy Framework, that mechanism may apply instead of the SCCs, to the extent it covers the transfer.
            </p>
            <p className="text-gray-700 mb-4">
              12.6 <strong>Precedence.</strong> If the SCCs conflict with this DPA or the Agreement, the SCCs prevail.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Liability</h2>
            <p className="text-gray-700 mb-4">
              Each party's liability under this DPA is subject to the limitations and exclusions of liability in the Agreement. This Section does not limit either party's liability to Data Subjects under the SCCs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Term and Changes</h2>
            <p className="text-gray-700 mb-4">
              14.1 This DPA stays in effect for as long as FollowFunnel Processes Customer Data.
            </p>
            <p className="text-gray-700 mb-4">
              14.2 FollowFunnel may update this DPA to reflect changes in law or in the Services, with at least 30 days' notice. An update will not reduce the overall protection given to Customer Data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact</h2>
            <p className="text-gray-700 mb-4">
              Privacy questions and notices under this DPA:{' '}
              <a href="mailto:privacy@followfunnel.app" className="text-blue-600 hover:underline">privacy@followfunnel.app</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Schedule 1: Details of Processing (SCC Annex I)</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">A. List of Parties</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900 w-1/4" />
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Data exporter</th>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Data importer</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Name</td>
                    <td className="p-3 border-b border-gray-200">The Customer identified in the Agreement</td>
                    <td className="p-3 border-b border-gray-200">IA Lonestar Tech Consulting, doing business as FollowFunnel</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Address</td>
                    <td className="p-3 border-b border-gray-200">The address associated with the Customer's account</td>
                    <td className="p-3 border-b border-gray-200">2591 Dallas Parkway STE 300-179, Frisco, TX 75034, USA</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Contact</td>
                    <td className="p-3 border-b border-gray-200">The Customer's account email</td>
                    <td className="p-3 border-b border-gray-200">
                      <a href="mailto:privacy@followfunnel.app" className="text-blue-600 hover:underline">privacy@followfunnel.app</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Activities</td>
                    <td className="p-3 border-b border-gray-200">Use of the Services to send follow-up emails after Zoom meetings and webinars</td>
                    <td className="p-3 border-b border-gray-200">Provision of the Services</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Role</td>
                    <td className="p-3 border-b border-gray-200">Controller (or Processor)</td>
                    <td className="p-3 border-b border-gray-200">Processor (or Sub-processor)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Signature and date</td>
                    <td className="p-3">Deemed signed on acceptance of the Agreement</td>
                    <td className="p-3">Deemed signed on acceptance of the Agreement</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">B. Description of Processing</h3>
            <p className="text-gray-700 mb-2"><strong>Categories of Data Subjects.</strong> Attendees and registrants of the Customer's Zoom meetings and webinars, including those who registered but did not attend.</p>
            <p className="text-gray-700 mb-2"><strong>Categories of Personal Data.</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Identity and contact details: first name, last name and email address.</li>
              <li>Professional details: company and job title, where collected at registration.</li>
              <li>Location: city and country, where collected at registration.</li>
              <li>Meeting data: meeting title, registration and attendance status, and meeting recording link.</li>
              <li>Email content: the follow-up email templates the Customer writes, after merge fields are filled in for each recipient.</li>
              <li>Send logs: recipient, time sent and delivery status.</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Special categories of data.</strong> None. The Customer must not submit special categories of Personal Data (see Section 4(d)).
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Frequency of transfer.</strong> Continuous, for as long as the Customer uses the Services.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Nature of Processing.</strong> Collection from the Zoom API, storage, organization (sorting into attendees and no-shows), merging into email templates, transmission through the Gmail API, and deletion.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Purpose of Processing.</strong> To send the Customer's follow-up emails to meeting attendees and no-shows after each meeting, as the Customer has configured.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Retention.</strong> Attendee and registrant data is kept until the Customer deletes it or its account. All Customer Data is deleted as described in Section 11.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Transfers to Sub-processors.</strong> As set out in Schedule 3. Sub-processors Process data for the same purposes and for the duration of the Agreement.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">C. Competent Supervisory Authority</h3>
            <p className="text-gray-700 mb-4">As set out in Section 12.2(h).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Schedule 2: Technical and Organizational Measures (SCC Annex II)</h2>
            <p className="text-gray-700 mb-2"><strong>Encryption</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>All data is encrypted in transit using TLS 1.2 or higher.</li>
              <li>The database is encrypted at rest with AES-256 (Supabase), and its backups are encrypted too.</li>
              <li>OAuth access and refresh tokens for Zoom and Gmail are held by a dedicated token-management provider (Nango), are never exposed to the browser, and are encrypted at rest.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Access control</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Access to Customer Data in the application is scoped to the Customer's authenticated account. FollowFunnel's automation server accesses the database with a server credential that is not limited by end-user Row Level Security.</li>
              <li>Administrative access to production systems is limited to authorized personnel and protected by multi-factor authentication.</li>
              <li>Secrets and API keys are stored as environment variables and are not stored in source code.</li>
              <li>Access is granted on a least-privilege basis and removed when no longer needed.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Minimal OAuth scopes</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The Services request only the Zoom scopes needed to read meeting, attendee and registrant data.</li>
              <li>The Services request only the Gmail scope needed to send email (gmail.send). FollowFunnel does not read the Customer's mailbox.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Infrastructure security</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The automation server (VPS) runs with a firewall, SSH key-only authentication, and regular operating system and application security updates.</li>
              <li>Webhooks are verified with signed secrets.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Data minimization and retention</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>FollowFunnel stores only the attendee fields needed to send follow-up emails.</li>
              <li>Retention follows Schedule 1. The Customer can delete its account and data on a self-service basis.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Availability and resilience</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The database is backed up daily by the database provider.</li>
              <li>Service health is monitored.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Incident response</strong></p>
            <p className="text-gray-700 mb-4">
              FollowFunnel maintains a documented process to detect, contain, investigate and notify Security Incidents within the timelines in Section 9.
            </p>
            <p className="text-gray-700 mb-2"><strong>Sub-processor oversight</strong></p>
            <p className="text-gray-700 mb-4">
              Sub-processors are chosen for their security practices and bound by data protection terms. Their own security measures are described in their DPAs.
            </p>
            <p className="text-gray-700 mb-2"><strong>Personnel</strong></p>
            <p className="text-gray-700 mb-4">
              Everyone with access to Customer Data is bound by confidentiality obligations.
            </p>
          </section>

          <section id="subprocessors" className="mb-8 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Schedule 3: Sub-processors (SCC Annex III)</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Sub-processor</th>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Entity and location</th>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Purpose</th>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Data processed</th>
                    <th className="p-3 border-b border-gray-200 font-semibold text-gray-900">Transfer safeguard</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Supabase</td>
                    <td className="p-3 border-b border-gray-200">Supabase Pte. Ltd., Singapore. Hosting region: US</td>
                    <td className="p-3 border-b border-gray-200">Database and authentication</td>
                    <td className="p-3 border-b border-gray-200">All Customer Data</td>
                    <td className="p-3 border-b border-gray-200">SCCs (Supabase DPA)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Hostinger</td>
                    <td className="p-3 border-b border-gray-200">Hostinger International Ltd., Cyprus (EU). VPS location: US</td>
                    <td className="p-3 border-b border-gray-200">Hosting for the automation server that runs FollowFunnel's workflows</td>
                    <td className="p-3 border-b border-gray-200">Attendee data in transit, and send logs</td>
                    <td className="p-3 border-b border-gray-200">EU entity. SCCs for any onward transfer (Hostinger DPA)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Vercel</td>
                    <td className="p-3 border-b border-gray-200">Vercel Inc., USA</td>
                    <td className="p-3 border-b border-gray-200">Hosting for the web application and front end</td>
                    <td className="p-3 border-b border-gray-200">Request data, and account data in transit</td>
                    <td className="p-3 border-b border-gray-200">SCCs (Vercel DPA)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-gray-200 font-medium">Nango</td>
                    <td className="p-3 border-b border-gray-200">Nango Inc., USA</td>
                    <td className="p-3 border-b border-gray-200">Managing and refreshing OAuth tokens for the Customer's Zoom and Gmail connections</td>
                    <td className="p-3 border-b border-gray-200">OAuth tokens, and API data in transit</td>
                    <td className="p-3 border-b border-gray-200">SCCs (Nango DPA)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Stripe</td>
                    <td className="p-3">Stripe, Inc., USA</td>
                    <td className="p-3">Payment processing</td>
                    <td className="p-3">Customer billing data (no attendee data)</td>
                    <td className="p-3">Data Privacy Framework and SCCs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 mb-4">
              <strong>Services the Customer connects (not Sub-processors).</strong> The Customer's own Zoom account and Google (Gmail) account are services the Customer chooses and contracts for directly. FollowFunnel accesses them only on the Customer's instructions and with the Customer's OAuth authorization. Zoom Video Communications, Inc. and Google LLC process that data under their own agreements with the Customer, not as Sub-processors of FollowFunnel.
            </p>
            <p className="text-gray-700 mb-4">
              The current list is published at{' '}
              <a href="https://www.followfunnel.app/dpa#subprocessors" className="text-blue-600 hover:underline">https://www.followfunnel.app/dpa#subprocessors</a>
              . Changes follow Section 7.3.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
