import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";

interface NewsItem {
  title: string;
  summary: string;
  content: string;
  date: string;
  location: string;
  category: string;
  priority: string;
  imageUrl: string;
  url: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchNews = async () => {
    try {
      const res = await fetch("https://redzoned.onrender.com/api/news");
      const data = await res.json();
      setNews(data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Navbar */}
      <Navbar activePage="news" />

      {/* Page Content */}
      <div className="pt-24 pb-16 px-4">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <Newspaper className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Safety News
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest crime reports and safety updates from your area.
          </p>
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-600">No news available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {news.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/400x200"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.summary?.slice(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center text-gray-500 text-xs">
                    <span>{item.location}</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
