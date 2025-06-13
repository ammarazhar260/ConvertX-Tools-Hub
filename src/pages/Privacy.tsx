
import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">Last updated: May 13, 2025</p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">1. Information We Collect</h2>
          <p>
            ConvertX collects information to provide better services to all our users. We collect information in the following ways:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>Information you give us.</strong> For example, our services require you to sign up for an account. When you do, we'll ask for personal information, like your name, email address, or telephone number.
            </li>
            <li>
              <strong>Information we get from your use of our services.</strong> We collect information about the services that you use and how you use them, like when you upload a document for conversion, visit a website that uses our services, or view and interact with our content.
            </li>
          </ul>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">2. How We Use Information</h2>
          <p>
            We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect ConvertX and our users.
          </p>
          <p className="mt-4">
            We use information collected from cookies and other technologies to improve your user experience and the overall quality of our services.
          </p>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">3. Information We Share</h2>
          <p>
            We do not share personal information with companies, organizations, or individuals outside of ConvertX except in the following cases:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>With your consent.</strong> We will share personal information with companies, organizations, or individuals outside of ConvertX when we have your consent to do so.
            </li>
            <li>
              <strong>For legal reasons.</strong> We will share personal information with companies, organizations, or individuals outside of ConvertX if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.
            </li>
          </ul>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">4. Data Security</h2>
          <p>
            We work hard to protect ConvertX and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular, we:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Encrypt many of our services using SSL.</li>
            <li>Review our information collection, storage, and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
            <li>Restrict access to personal information to ConvertX employees, contractors, and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations and may be disciplined or terminated if they fail to meet these obligations.</li>
          </ul>
          
          <h2 className="mt-8 mb-4 text-xl font-semibold">5. Changes</h2>
          <p>
            Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice (including, for certain services, email notification of privacy policy changes).
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
