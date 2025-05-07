import { AnimatePresence, motion } from "framer-motion";

const HeroSide = ({ authMode }: { authMode: string }) => {
  return (
    <motion.div
      className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-auto"
      initial={false}
      animate={{
        backgroundPosition: authMode === "login" ? "center" : "left center",
      }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/5554246/pexels-photo-5554246.jpeg)`,
          filter: "brightness(0.85)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-700/70 via-teal-500/20 to-emerald-400/50" />

      <div className="relative h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="text-white text-center"
          >
            <h1 className="text-3xl font-bold mb-2">FrostAcademy</h1>
            <p className="text-lg">Plataforma Educativa</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HeroSide;
