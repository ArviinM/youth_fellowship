function Hero() {

    return (
        <>
            <div className="hero min-h-screen absolute -z-50"
                 style={{backgroundImage: 'url(main-image.webp)'}}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className=" text-center text-neutral-content">
                    <div className="max-w-4xl">
                        <img src="/phcc-logo.png" alt="logo"
                             className='w-1/3 items-center m-auto brightness-90 mb-3'/>
                        <h1 className="mb-5 text-5xl md:text-7xl lg:text-9xl font-bold  font-custom select-none">YOUTH
                            FELLOWSHIP</h1>
                        <p className="mb-1 text-xl md:text-2xl lg:text-3xl font-light select-none">Finally, all of you,
                            be
                            like-minded,
                            be
                            sympathetic, love
                            one
                            another, be compassionate and humble </p>
                        <p className="mb-5 text-xl md:text-2xl lg:text-3xl font-bold">1 Peter 3:8 </p>
                    </div>
                </div>
            </div>

            <img src="/people-cut.png" alt="logo"
                 className='w-full lg:w-1/3 items-center m-auto bottom-0 absolute left-1/2 transform -translate-x-1/2 brightness-90 saturate-100'/>
        </>)
}

export default Hero
