import { motion } from "framer-motion";

export default function LogoCompany() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#002868] via-[#003580] to-[#001f4d] flex-col justify-center items-center p-12 text-white"
            >
                <div className="max-w-md space-y-8 text-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <img
                            src="/images/logos.png"
                            alt="RBT Bank Inc Logo"
                            className="object-contain h-60 w-60 drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* Company Info */}
                    {/* <div>
                            <h1 className="mb-3 text-5xl font-bold">
                                RBT Bank Inc.
                            </h1>
                        </div> */}

                    {/* System Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-[#D4AF37]/10 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/30"
                    >
                        <h2 className="text-3xl font-bold mb-2 text-[#D4AF37]">
                            RBT Compliance Hub
                        </h2>
                        <p className="text-sm text-gray-200">
                            BSP-Regulated Anti-Money Laundering Act Compliance
                            Platform
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
