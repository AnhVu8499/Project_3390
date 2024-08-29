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
                Paris Nails & Hair Salon
            </div>
            <div className='intro-bg'>
                <img id='intro-bg-src'src={nailsBG} alt='Intro background'/>
                <p className="intro-sentence">
                    PARIS NAILS SPA
                    <p>Professional Nails Care for Ladies and Gentlement</p>
                </p>
                <button className='book-now'onClick={scrollToBookingSection}>BOOK NOW</button>
            </div>
            <div className="intro">
                <img src={nailsPainting} 
                    alt='Nails Sample' id='sample-1'/>
                <ul className="main">
                    <li><strong>Full-Range Nail Techniques:</strong> Choose from regular polish, gel, acrylic, or dip powder for a flawless finish every time.</li>
                    <li><strong>Hair Styling Expertise:</strong> Whether it’s a trim, coloring, or a full transformation, our expert stylists ensure you leave looking and feeling fabulous.</li>
                    <li><strong>Various Nail Lengths:</strong> From chic short nails to daringly long, your style is in your hands—literally!</li>
                    <li><strong>Popular Nail Shapes:</strong> Whether you love coffin, square, stiletto, almond, or round shapes, we can shape your nails to perfection.</li>
                    <li><strong>Custom Designs:</strong> Our skilled technicians can craft everything from timeless French tips to trendy ombre or intricate nail art. Don’t hesitate to request your unique design.</li>
                    <li><strong>Hundreds of Nail Colors:</strong> We keep our palette updated with the latest colors for every season and special occasion, ensuring you always find the perfect shade.</li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
