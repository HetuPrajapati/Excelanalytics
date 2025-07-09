"use client"

import { motion } from "framer-motion"
import { Users, Award, Clock, Shield } from "lucide-react"

const About = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            About ExcelAnalytics
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            We're on a mission to make Excel analytics accessible to everyone.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-6">
                ExcelAnalytics was founded in 2020 with a simple goal: to make data analytics accessible to everyone. We
                believe that data should be easy to understand and analyze, regardless of technical expertise.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of data scientists and developers have created a platform that allows anyone to upload Excel
                files and get instant insights without needing to know complex formulas or programming languages.
              </p>
              <p className="text-gray-600">
                Today, thousands of users from around the world use ExcelAnalytics to analyze their data and make better
                decisions. From small businesses to large enterprises, our platform helps everyone unlock the power of
                their data.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">User-Friendly</h3>
              <p className="text-gray-600">
                Our platform is designed to be intuitive and easy to use, even for those with no technical background.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Powerful Analytics</h3>
              <p className="text-gray-600">
                Get deep insights from your data with our advanced analytics tools and visualizations.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                What would take hours in Excel can be done in minutes with our automated analysis tools.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">
                Your data is encrypted and secure. We never share your information with third parties.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden text-white">
            <div className="p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of users who are already analyzing their data with Rareblocks.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors"
              >
                Create Free Account
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default About
