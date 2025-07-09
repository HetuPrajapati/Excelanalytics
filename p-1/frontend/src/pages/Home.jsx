"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from "react-router-dom"

const Home = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert(`Email submitted: ${email}`)
    setEmail("")
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Turn Complex Data into Clear Insights.
          </motion.h1>

          <motion.p className="text-lg text-gray-600" data-aos="fade-up" data-aos-delay="200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <input
              type="email"
              placeholder="Enter email address"
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.form>

          <motion.div className="flex flex-wrap gap-12 pt-6" data-aos="fade-up" data-aos-delay="400">
            <div className="flex flex-col">
              <motion.span
                className="text-4xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                2943
              </motion.span>
              <span className="text-gray-600">Lorem, ipsum dolor.</span>
            </div>

            <div className="flex items-center">
              <div className="h-12 w-0.5 bg-gray-200 mx-4"></div>
            </div>

            <div className="flex flex-col">
              <motion.span
                className="text-4xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                $1M+
              </motion.span>
              <span className="text-gray-600">Lorem ipsum dolor sit.</span>
            </div>
          </motion.div>

          <motion.div className="pt-6" data-aos="fade-up" data-aos-delay="500">
            <Link to="/upload">
              <motion.button
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload Excel File
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute -top-10 -left-10 w-24 h-24"
            animate={{
              rotate: [0, 10, 0, -10, 0],
              y: [0, -5, 0, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
              <path
                d="M20,50 C20,30 30,20 50,20 C70,20 80,30 80,50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M20,50 C20,70 30,80 50,80 C70,80 80,70 80,50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute -top-5 right-10 w-16 h-16"
            animate={{
              rotate: [0, 15, 0, -15, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 6,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
              <path
                d="M20,20 C40,0 60,0 80,20 C100,40 100,60 80,80 C60,100 40,100 20,80 C0,60 0,40 20,20 Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute -bottom-5 right-10 w-20 h-20"
            animate={{
              rotate: [0, -10, 0, 10, 0],
              x: [0, 5, 0, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 7,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
              <path
                d="M10,30 C10,30 30,10 50,10 C70,10 90,30 90,30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M10,50 C10,50 30,30 50,30 C70,30 90,50 90,50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M10,70 C10,70 30,50 50,50 C70,50 90,70 90,70"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.div
            className="relative rounded-lg overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <img
              src="https://img.freepik.com/free-vector/setup-analytics-concept-illustration_114360-1438.jpg?ga=GA1.1.1123202589.1707237283&semt=ais_items_boosted&w=740"
              alt="Rareblocks Credit Card"
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
