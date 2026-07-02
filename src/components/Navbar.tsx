function Navbar(){

    return(

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <a className="navbar-brand" href="/">
                    🎮 PokéDex
                </a>


                <button 
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                <div 
                className="collapse navbar-collapse"
                id="menu"
                >

                    <ul className="navbar-nav ms-auto">


                        <li className="nav-item">

                            <a 
                            className="nav-link active"
                            href="/"
                            >
                                Inicio
                            </a>

                        </li>


                        <li className="nav-item">

                            <a 
                            className="nav-link"
                            href="/favorites"
                            >
                                ❤️ Favoritos
                            </a>

                        </li>


                    </ul>


                </div>


            </div>


        </nav>

    )

}


export default Navbar;