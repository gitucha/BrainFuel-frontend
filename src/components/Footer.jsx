import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} BrainFuel. All rights reserved.</p>
        <p className="mt-2">
          Made with love for learners worldwide •{" "}
          <a
            href="/terms"
            className="text-blue-600 hover:underline"
          >
            Terms & Conditions
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
