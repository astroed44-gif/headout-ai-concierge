import Link from "next/link";

export default function Footer() {
  const columns = [
    {
      title: "Headout",
      links: ["About us", "Blog", "Careers", "Press", "Sustainability"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Cancellation Policy", "COVID-19 Safety"],
    },
    {
      title: "Explore",
      links: ["Paris", "London", "Rome", "Barcelona", "Dubai", "New York"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="/" className="text-sm hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">✈ headout</span>
            <span className="text-gray-500 text-sm">© 2024 Headout Inc.</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>🌍 English</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
