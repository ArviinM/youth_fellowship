import {motion} from 'framer-motion'

function Home() {
    const bgAnimate = {
        hidden: {
            // scale: 2.5,
            y: -100,
            scale: 1.0
            // clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        },
        show: {
            // scale: 1.0,
            y: 100,
            // clipPath: 'polygon(21% 27%, 77% 26%, 77% 77%, 21% 77%)',
            transition: {
                ease: 'easeInOut',
                duration: 2,
                delay: 1
            }
        }
    }

    const bgAnimate2 = {
        hidden: {
            scale: 0.2,
            opacity: 0
            // clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        },
        show: {
            scale: 0.4,
            opacity: 1,
            // clipPath: 'polygon(21% 27%, 77% 26%, 77% 77%, 21% 77%)',
            transition: {
                ease: 'easeInOut',
                duration: 2,
                delay: 2.3
            }
        }
    }

    const textAnimate1 = {
        hidden: {y: '100%', opacity: 0},
        show: {
            y: 0, opacity: 1,
            transition: {
                ease: 'easeInOut',
                duration: 0.8,
                delay: 2
            }
        }
    }

    const textAnimate2 = {
        hidden: {y: '100%', opacity: 0},
        show: {
            y: 0, opacity: 1,
            transition: {
                ease: 'easeInOut',
                duration: 0.8,
                delay: 2
            }
        }
    }

    // const scrollingText = {
    //     initial: {x: "100%"},
    //     show: {x: "-100%", transition: {duration: 30, repeat: Infinity}}
    // }

    return <>
        <div className=''>
            <motion.div className='absolute inset-0 w-full -z-10' variants={bgAnimate}
                        initial='hidden' animate='show'>
                <img src='/bg-main.webp' alt='backgroundImage'
                     className='object-cover'/>
            </motion.div>
            <div className="relative text-center pt-10">
                <motion.h1
                    className='text-9xl select-none font-bold py-4 text-[#1b60c1] font-custom drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'
                    variants={textAnimate1}
                    initial='hidden' animate='show'>Youth Fellowship
                </motion.h1>
                <motion.p
                    className="text-5xl font-bold uppercase tracking-tigther drop-shadow-[0_0.8px_0.8px_rgba(0,0,0,0.8)]"
                    variants={textAnimate2}
                    initial='hidden' animate='show'>November 27, 2023
                </motion.p>
            </div>
            <motion.div className='absolute inset-0 w-full -z-10' variants={bgAnimate2}
                        initial='hidden' animate='show'>
                <img src='/main-image.webp' alt='backgroundImage'
                     className='object-cover '/>
            </motion.div>

            {/*<motion.div className="fixed bottom-0 w-full text-center text-5xl font-custom" variants={scrollingText}*/}
            {/*            initial='initial' animate='show'>*/}
            {/*    PREACHING | GAMES | PRAISE AND WORSHIP*/}
            {/*</motion.div>*/}
        </div>
    </>
}

export default Home