import { React } from 'react';
import './styles.css';
import nailsBG from '../img/nails-bg.jpg';
import nailsPainting from '../img/painting.jpg';

const Header = ({ bookingSectionRef }) => {
    const scrollToBookingSection = () => {
        if (bookingSectionRef.current) {
            bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div className='header'>
            <div className="name">
                <p>Paris Nails & Hair Salon</p>
                <div className="opening">
                    <div className="business-day">Hétfő - Vasárnap</div>
                    <div className="business-hours">9AM - 8PM</div>
                </div>
            </div>
            <div className='intro-bg'>
                <img id='intro-bg-src'src={nailsBG} alt='Intro background'/>
                <p className="intro-sentence">
                    PARIS NAILS SZALON
                    <p>Professzionális körömápolás hölgyeknek és uraknak</p>
                </p>
                <button className='book-now'onClick={scrollToBookingSection}>FOGLALJON MOST</button>
            </div>
            <div className="intro">
                <img src={nailsPainting} 
                    alt='Nails Sample' id='sample-1'/>
                <ul className="main">
                    <li><strong>Teljes körű körömtechnikák:</strong> Válasszon a hagyományos lakk, gél, akril vagy dip por közül a tökéletes eredmény érdekében.</li>
                    <li><strong>Hajformázási szakértelem:</strong> Legyen szó hajvágásról, hajszínezésről vagy teljes átalakításról, szakértő stylistjaink garantálják, hogy csodálatosan néz ki és érzi magát, amikor távozik.</li>
                    <li><strong>Különböző körömhosszúságok:</strong> A stílus a kezedben van – akár elegáns rövid körmöket, akár merész hosszúakat választ!</li>
                    <li><strong>Népszerű körömformák:</strong> Legyen szó koporsó, szögletes, stiletto, mandula vagy kerek formákról, körmeit tökéletesre formázzuk.</li>
                    <li><strong>Egyedi tervek:</strong> Szakértő technikusaink mindent elkészíthetnek, a klasszikus francia manikűrtől kezdve a divatos ombréig vagy bonyolult körömművészetig. Ne habozzon kérni egyedi tervét.</li>
                    <li><strong>Több száz körömszín:</strong> Palettánkat folyamatosan frissítjük a legújabb színekkel minden évszakra és különleges alkalomra, így biztos lehet benne, hogy mindig megtalálja a tökéletes árnyalatot.</li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
