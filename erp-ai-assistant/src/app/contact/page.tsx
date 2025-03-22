import { FiMail, FiPhone, FiMapPin, FiMessageSquare } from "react-icons/fi";

export const metadata = {
  title: "Contact Us | IDMS AI Assistant",
  description:
    "Get in touch with our team to learn more about our AI-powered enterprise support solution",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Get in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Have questions about our AI-powered enterprise support solution?
                We're here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  Reach out to our team for any questions about implementing
                  AI-powered support for your ERP.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium">Email</h3>
                    <p className="mt-1 text-muted-foreground">
                      info@idmsai.com
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      support@idmsai.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium">Phone</h3>
                    <p className="mt-1 text-muted-foreground">
                      +91 (123) 456-7890 (Sales)
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      +91 (123) 456-7891 (Support)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium">Office Location</h3>
                    <p className="mt-1 text-muted-foreground">
                      Tech Park, 4th Floor
                      <br />
                      123 Innovation Street
                      <br />
                      Bengaluru, India 560001
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-4">Schedule a Demo</h3>
                <p className="text-muted-foreground mb-4">
                  See our AI assistant in action with a personalized demo
                  tailored to your ERP needs.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">
                      Live demonstration of AI assistant capabilities
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">
                      Custom integration assessment for your ERP
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">
                      ROI analysis and implementation timeline
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Send us a message</h2>
                <p className="text-muted-foreground mt-2">
                  We'll get back to you within 24 hours
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="demo">Request a Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="integration">Integration Questions</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  <FiMessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px]">
              Find quick answers to common questions about our AI assistant
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-medium mb-2">
                How quickly can the AI assistant be implemented?
              </h3>
              <p className="text-muted-foreground">
                Typical implementation takes 2-4 weeks, depending on the
                complexity of your ERP setup and customization requirements.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-medium mb-2">
                Is my data secure with your AI solution?
              </h3>
              <p className="text-muted-foreground">
                Yes, we use enterprise-grade encryption and OAuth2
                authentication, with all data processing compliant with industry
                standards like GDPR.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-medium mb-2">
                Do you offer custom integrations for our specific ERP?
              </h3>
              <p className="text-muted-foreground">
                Yes, our solution can be customized to integrate with any ERP
                system through our robust API framework.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6">
              <h3 className="text-lg font-medium mb-2">
                How does the system handle complex GST calculations?
              </h3>
              <p className="text-muted-foreground">
                Our AI is trained on the latest GST regulations and can retrieve
                real-time data from your ERP for accurate tax calculations and
                reporting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
