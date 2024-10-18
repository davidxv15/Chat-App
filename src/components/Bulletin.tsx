import React, { useState, useEffect } from "react";

interface Quote {
  author: string;
  text: string;
}

const Bulletin: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  // Fetch the JSON file on component mount
  useEffect(() => {
    fetch('/assets/Quotes.json')
      .then((response) => response.json())
      .then((data) => {
        const quotes = data.quotes;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
      })
      .catch((error) => console.error('Error loading quotes:', error));
  }, []);


  return (
    <div
      className="bulletin rounded bg-gray-800 text-center px-14 py-4 mb-4 mt-4 border border-gray-300 dark:border-gray-800"
      role="complementary"
      aria-labelledby="bulletin-title"
      aria-describedby="bulletin-description"
    >
      <h2 className="text-2xl font-bold text-blue-600" id="bulletin-title">
      {quote ? "Quote of the Day" : "Your Ad Here!"}
      </h2>
      <p id="bulletin-description" className="text-gray-400 p-2">
      {quote ? `"${quote.text}" - ${quote.author}` : "Visit our sponsors! Advertise here!"}
      </p>
      <p
        className="contact text-white"
        aria-label="Contact for advertisement inquiries"
      >
        Contact{" "}
      </p>
    </div>
  );
};

export default Bulletin;
