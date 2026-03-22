import { Link } from "react-router-dom";

function NavList() {

    // const navLinks = ['الرئيسية', 'الحمولات', 'من نحن', 'آراء العملاء'].reverse();
    const navLinks = [
        {
            title: 'الرئيسية',
            path: '/'
        }, {
            title: 'الحمولات',
            path: '/shipments'
        }, {
            title: 'من نحن',
            path: '',
        }, {
            title: 'آراء عملائنا',
            path: ''
        }
    ].reverse();

    return (
        <ul className="flex items-center flex-row-reverse gap-5">
            {
                navLinks.map(({ title, path }, idx) => {
                    return (
                        <Link key={idx} to={path}>
                            <li className="font-main font-medium text-2xl text-capitalize text-(--primary-text) cursor-pointer duration-300 hover:text-(--primary-color)">{ title }</li>
                        </Link>
                    );
                })
            }
        </ul>
    );
};

export default NavList;