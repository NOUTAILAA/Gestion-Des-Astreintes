import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Home.css'; // Assurez-vous que ce fichier existe
import Navbar from './Navbar'; // Assurez-vous que le chemin est correct
const animationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
};

const Home = () => {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Change la clé pour redémarrer l'animation toutes les 7 secondes
        const interval = setInterval(() => {
            setAnimationKey(prevKey => prevKey + 1);
        }, 7000); // 7000 millisecondes = 7 secondes

        return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
    }, []);

    return (
        <div>
            <Navbar />
            <div className="home-content">
                <motion.div 
                    className="jumbotron"
                    key={animationKey} // Change la clé pour réinitialiser l'animation
                    initial="hidden"
                    animate="visible"
                    variants={animationVariants}
                    transition={{ duration: 1 }}
                >
                    <motion.h1 
                        className="display-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Bienvenue dans le Système de Gestion des Plannings
                    </motion.h1>
                    <motion.p 
                        className="lead"
                        initial="hidden"
                        animate="visible"
                        variants={animationVariants}
                        transition={{ duration: 1, delay: 1 }}
                    >
Consultez vos gardes à venir, vérifiez vos disponibilités et restez informé en temps réel.                     </motion.p>
                </motion.div>
            </div>
            
        </div>
    );
};

export default Home;
