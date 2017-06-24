import * as React from "react";
import Heading from './heading';


import './style/root.scss';
import './style/menu-top.scss';
import './style/footer.scss';


export default function Root() {
    return (
        <div className="root">


            <nav className="top">
                <div className="left">
                    <Heading/>


                    aaaaaa
                </div>
                {/*<ul>
                    <li>Menu 1</li>
                    <li>Menu 2</li>
                    <li>Menu 3</li>
                </ul>
                <div className="right">

                    <button>Uložit</button>

                </div>*/}
            </nav>



            <footer>
                footer
            </footer>


        </div>
    )
}