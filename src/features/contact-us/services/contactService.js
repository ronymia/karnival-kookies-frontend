// ==================== CONTACT SERVICE ====================

export const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "custom-order", label: "Custom Cookie / Cake Order" },
  { value: "catering", label: "Event Catering & Parties" },
  { value: "order-support", label: "Order Support & Tracking" },
  { value: "feedback", label: "Bakery Feedback / Compliments" },
];

export const SUPPORT_CONTACTS = [
  {
    id: "email",
    title: "Email Us",
    subtitle: "Direct bakery concierge",
    description: "We typically respond within 24 hours.",
    iconType: "email",
    items: [
      {
        label: "support@karnivalkookies.com",
        href: "mailto:support@karnivalkookies.com",
      },
      {
        label: "orders@karnivalkookies.com",
        href: "mailto:orders@karnivalkookies.com",
      },
    ],
  },
  {
    id: "phone",
    title: "Call Us",
    subtitle: "Customer support & orders",
    description: "Mon – Sat: 9:00 AM – 9:00 PM EST",
    iconType: "phone",
    items: [
      {
        label: "+1 (123) 456-7890",
        href: "tel:+11234567890",
      },
      {
        label: "+1 (800) 555-COOK",
        href: "tel:+18005552665",
      },
    ],
  },
  {
    id: "location",
    title: "Visit Our Bakery",
    subtitle: "Fresh batch pickup & shop",
    description: "Freshly baking artisan treats every morning.",
    iconType: "location",
    items: [
      {
        label: "975 Liberty Ave, Union, NJ 07083",
        href: "https://maps.google.com/?q=975+Liberty+Ave,+Union,+NJ+07083",
        isExternal: true,
      },
    ],
  },
];

export const FALLBACK_FAQS = [
  {
    question: "How fresh are Karnival Kookies when delivered?",
    answer:
      "All our cookies and artisanal treats are baked fresh daily to order using premium single-origin chocolate, pure European butter, and Madagascar vanilla. We heat-seal every treat within minutes of cooling to lock in maximum oven-freshness.",
  },
  {
    question: "Do you accommodate custom orders or event catering?",
    answer:
      "Yes! We specialize in custom cookie towers, celebration cake boxes, corporate gifting, and wedding dessert tables. Contact us at least 48 hours in advance for custom batch inquiries.",
  },
  {
    question: "How should I store and reheat my treats for the best experience?",
    answer:
      "Keep them in an airtight container at room temperature for up to 5 days. For that signature gooey, warm bakery-center experience, warm your cookies in a preheated 350°F (175°C) oven for 2–3 minutes or microwave for 10–12 seconds.",
  },
  {
    question: "Do you offer nationwide shipping?",
    answer:
      "Yes, we ship nationwide across the United States using expedited climate-controlled packaging to ensure your gourmet cookies arrive in pristine condition.",
  },
];

export class ContactService {
  /**
   * Validates contact form submission.
   */
  static validate(formData) {
    const errors = {};

    if (!formData?.name || formData.name.trim() === "") {
      errors.name = "Full name is required";
    }

    if (!formData?.email || formData.email.trim() === "") {
      errors.email = "Email address is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData.email.trim()
      )
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData?.message || formData.message.trim() === "") {
      errors.message = "Please write a message";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters long";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Returns default contact form state.
   */
  static getDefaultFormData() {
    return {
      name: "",
      email: "",
      phone: "",
      inquiryType: "general",
      message: "",
    };
  }
}

export const contactService = ContactService;
