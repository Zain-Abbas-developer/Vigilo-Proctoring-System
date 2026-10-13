import { motion } from 'framer-motion';

const Button = ({
    children
}) => {
  return (
    <motion.button className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70">
      {children}
    </motion.button>
  )
}
export default Button
