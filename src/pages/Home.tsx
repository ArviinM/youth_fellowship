function Home() {

    return <>
        <div className="hero min-h-screen absolute"
             style={{backgroundImage: 'url(main-image.webp)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className=" text-center text-neutral-content">
                <div className="max-w-4xl">
                    <h1 className="mb-5 text-6xl lg:text-9xl font-bold font-custom select-none">YOUTH FELLOWSHIP</h1>
                    <p className="mb-1 text-3xl font-medium select-none">Finally, all of you, be like-minded, be
                        sympathetic, love
                        one
                        another, be compassionate and humble </p>
                    <p className="mb-5 text-3xl font-bold">1 Peter 3:8 </p>
                    <button className="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    </>
}

export default Home