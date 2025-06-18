"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PrivacyPolicy() {
  const router = useRouter()
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className=" border px-5 py-2.5 hover:bg-gray-50 rounded-md " onClick={() => router.back()}> &larr; back</button>
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p className="text-gray-700 mb-6">
          At SGTMake, your privacy is a top priority. This Privacy Policy outlines how we collect, use, store, and
          protect your personal information when you visit our website, place an order, or communicate with us. By using
          our services, you agree to the terms outlined below.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">1. Information We Collect</h2>
          <p className="mb-3">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Personal Information:</span> Name, email address, phone number,
              billing/shipping address, and payment details when you place an order or fill out contact forms.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Technical Data:</span> IP address, browser type, operating system, and pages
              visited, collected via cookies and analytics tools to improve our website.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Communication Records:</span> Emails, chats, or calls with our support or
              sales teams for record-keeping and service improvement.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">2. How We Use Your Information</h2>
          <p className="mb-3">We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">Process and fulfil your orders.</li>
            <li className="text-gray-700">Provide customer service and respond to inquiries.</li>
            <li className="text-gray-700">Send updates, invoices, and delivery details.</li>
            <li className="text-gray-700">Improve our website functionality and user experience.</li>
            <li className="text-gray-700">Comply with legal and regulatory obligations.</li>
          </ul>
          <p className="mt-3 text-gray-700">
            We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
            3. Information Sharing and Disclosure
          </h2>
          <p className="mb-3">Your information may be shared with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Service Providers:</span> Trusted partners who assist with payment
              processing, shipping, marketing, and IT support, only to the extent necessary.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Legal Authorities:</span> When required by law, we may share your
              information with regulatory or law enforcement agencies.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Business Transfers:</span> In case of a merger, acquisition, or asset sale,
              your data may be transferred to the new entity.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">4. Data Security</h2>
          <p className="mb-3">
            We implement industry-standard security measures to protect your data from unauthorised access, alteration,
            or disclosure. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">SSL encryption for data transmission</li>
            <li className="text-gray-700">Secure servers and limited access controls</li>
            <li className="text-gray-700">Regular monitoring for security vulnerabilities</li>
          </ul>
          <p className="mt-3 text-gray-700">
            However, no system is 100% secure. While we strive to protect your data, we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">5. Cookies and Tracking</h2>
          <p className="mb-3">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">Analyse website traffic and user behaviour</li>
            <li className="text-gray-700">Personalise your experience</li>
            <li className="text-gray-700">Store session information for smoother navigation</li>
          </ul>
          <p className="mt-3 text-gray-700">
            You can control or disable cookies via your browser settings, though some features may not function properly
            without them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">6. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">Request access to the personal data we hold about you.</li>
            <li className="text-gray-700">Correct inaccuracies or update your information.</li>
            <li className="text-gray-700">
              Withdraw consent or request deletion of your data, subject to legal requirements.
            </li>
            <li className="text-gray-700">
              Opt out of marketing communications at any time via the unsubscribe link or by contacting us.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">7. Third-Party Links</h2>
          <p className="text-gray-700">
            Our website may contain links to third-party sites. We are not responsible for their content or privacy
            practices. Please review their policies before sharing your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">8. Policy Updates</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal
            requirements. Any updates will be posted on this page with a revised effective date. Continued use of our
            services implies your acceptance of the revised terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">9. Contact Us</h2>
          <p className="text-gray-700 mb-2">
            For any questions or concerns regarding this policy or your personal data, please contact:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">SGTMake</p>
            <p>
              Email:{" "}
              <Link href="mailto:privacy@sgtmake.com" className="text-blue-600 hover:underline">
                privacy@sgtmake.com
              </Link>
            </p>
            <p>
              Phone:{" "}
              <Link href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1234567890
              </Link>
            </p>
            <p>Address: 123 Manufacturing Way, Industrial District, City, Country</p>
          </div>
        </section>
      </div>

   
    </div>
  )
}
