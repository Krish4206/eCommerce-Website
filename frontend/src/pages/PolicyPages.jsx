import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";
import "./PolicyPages.css";

const PolicyLayout = ({ title, icon, children }) => (
  <div className="policy-page">
    <div className="policy-container">
      <Link to="/" className="policy-back">
        <FaArrowLeft /> Back to Home
      </Link>
      <div className="policy-header">
        <div className="policy-icon">{icon}</div>
        <h1>{title}</h1>
      </div>
      <div className="policy-content">{children}</div>
    </div>
  </div>
);

export const ShippingPolicy = () => (
  <PolicyLayout title="Shipping Policy" icon={<FaTruck />}>
    <h2>Delivery Timeline</h2>
    <p>
      At Sanjish, we ensure timely delivery of all orders within 3–7 business
      days across India.
    </p>

    <h3>Shipping Charges</h3>
    <ul>
      <li>
        <strong>Free Shipping</strong> on all orders above ₹499
      </li>
      <li>Orders below ₹499 incur a flat shipping fee of ₹49</li>
      <li>No hidden charges — all taxes included in the product price</li>
    </ul>

    <h3>Order Processing</h3>
    <ul>
      <li>Orders are processed within 24 hours of placement</li>
      <li>You will receive a confirmation email with tracking details</li>
      <li>
        Orders placed on weekends/holidays are processed the next business day
      </li>
    </ul>

    <h3>Cash on Delivery (COD)</h3>
    <p>COD is available on all orders. A nominal convenience fee may apply.</p>

    <h3>International Shipping</h3>
    <p>
      Currently, Sanjish ships only within India. International shipping coming
      soon.
    </p>
  </PolicyLayout>
);

export const ReturnPolicy = () => (
  <PolicyLayout title="Return Policy" icon={<FaUndo />}>
    <h2>7-Day Easy Returns</h2>
    <p>
      We want you to love your purchase. If you're not completely satisfied, you
      can return items within 7 days of delivery.
    </p>

    <h3>Eligibility</h3>
    <ul>
      <li>
        Items must be unused, unworn, and in original condition with all tags
        attached
      </li>
      <li>
        Footwear must be tried on a clean surface and returned in original box
      </li>
      <li>Intimate apparel cannot be returned for hygiene reasons</li>
    </ul>

    <h3>How to Return</h3>
    <ol>
      <li>Log in to your Sanjish account and go to My Orders</li>
      <li>Select the item you wish to return</li>
      <li>Choose a reason for return</li>
      <li>Schedule a free pickup or self-ship</li>
      <li>Refund will be processed within 5–7 business days after pickup</li>
    </ol>

    <h3>Refund Timeline</h3>
    <ul>
      <li>
        <strong>UPI/Card Payments:</strong> Refund in 5–7 business days
      </li>
      <li>
        <strong>COD Orders:</strong> Refund as Sanjish Store Credit (instant) or
        bank transfer (5–7 days)
      </li>
    </ul>

    <h3>Non-Returnable Items</h3>
    <ul>
      <li>Innerwear, lingerie, socks</li>
      <li>Personal care products</li>
      <li>Items with tampered tags or packaging</li>
    </ul>
  </PolicyLayout>
);

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy" icon={<FaShieldAlt />}>
    <h2>Your Privacy Matters</h2>
    <p>
      Sanjish respects your privacy. This policy outlines how we collect, use,
      and protect your personal information.
    </p>

    <h3>Information We Collect</h3>
    <ul>
      <li>
        <strong>Account Information:</strong> Name, email, phone number,
        shipping address
      </li>
      <li>
        <strong>Order Information:</strong> Products purchased, payment method,
        transaction details
      </li>
      <li>
        <strong>Browsing Data:</strong> Pages visited, products viewed, search
        queries
      </li>
      <li>
        <strong>Device Information:</strong> IP address, browser type, device
        type
      </li>
    </ul>

    <h3>How We Use Your Information</h3>
    <ul>
      <li>To process and fulfill your orders</li>
      <li>To personalize your shopping experience</li>
      <li>To send order updates and promotional offers (with consent)</li>
      <li>To improve our website and services</li>
    </ul>

    <h3>Data Protection</h3>
    <p>
      We implement industry-standard security measures including SSL encryption,
      secure servers, and regular security audits. Your payment information is
      never stored on our servers.
    </p>

    <h3>Third-Party Sharing</h3>
    <p>
      We do not sell your personal data. We may share necessary information
      with:
    </p>
    <ul>
      <li>Delivery partners for order fulfillment</li>
      <li>Payment gateways for transaction processing</li>
      <li>Legal authorities if required by law</li>
    </ul>
  </PolicyLayout>
);

export const TermsConditions = () => (
  <PolicyLayout title="Terms & Conditions" icon={<FaFileContract />}>
    <h2>Terms of Service</h2>
    <p>By using Sanjish, you agree to the following terms and conditions.</p>

    <h3>Account Responsibilities</h3>
    <ul>
      <li>You must provide accurate account information</li>
      <li>You are responsible for maintaining password confidentiality</li>
      <li>Notify us immediately of any unauthorized account use</li>
    </ul>

    <h3>Pricing & Payments</h3>
    <ul>
      <li>All prices are in Indian Rupees (₹) inclusive of applicable taxes</li>
      <li>We reserve the right to modify prices without prior notice</li>
      <li>Payment must be received before order processing</li>
    </ul>

    <h3>Order Cancellation</h3>
    <ul>
      <li>Orders can be cancelled within 24 hours of placement</li>
      <li>Once shipped, orders cannot be cancelled</li>
      <li>Cancelled orders will be refunded within 5–7 business days</li>
    </ul>

    <h3>Intellectual Property</h3>
    <p>
      All content on Sanjish — including logos, images, text, and design — is
      the property of Sanjish and may not be reproduced without written
      permission.
    </p>

    <h3>Limitation of Liability</h3>
    <p>
      Sanjish shall not be liable for any indirect, incidental, or consequential
      damages arising from the use of our services.
    </p>

    <h3>Contact</h3>
    <p>
      For any questions regarding these terms, contact us at{" "}
      <strong>support@sanjish.in</strong>
    </p>
  </PolicyLayout>
);
