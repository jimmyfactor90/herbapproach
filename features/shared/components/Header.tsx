"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { FaSearch, FaUser, FaShoppingCart, FaFacebook, FaInstagram, FaTwitter, FaChevronDown, FaEnvelope, FaShieldAlt, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCartStore } from "@/features/cart/store/cart.store";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "VALUE MENU", href: "/shop?filter=sale", subLinks: [] },
    { 
      name: "FLASH DEALS", 
      href: "/shop?filter=flash", 
      subLinks: [
        { name: "Flash Deals", href: "/shop?filter=flash" },
        { name: "Ounce Deals", href: "/shop?category=flowers&weight=ounce", hasDivider: true },
        { name: "New Arrivals", href: "/shop?filter=new", hasDivider: true },
        { name: "Bundle Packs", href: "/shop?category=bundles", hasDivider: true },
        { name: "Clearance", href: "/shop?filter=clearance", hasDivider: true },
      ] 
    },
    { 
      name: "FLOWERS", 
      href: "/shop?category=flowers", 
      isMega: true,
      megaContent: {
        categories: ["Dried Flower", "Pre-Rolls", "Moon Rocks"],
        sections: [
          {
            title: "Plant Type",
            links: [
              { name: "INDICA", href: "/shop?type=indica" },
              { name: "SATIVA", href: "/shop?type=sativa" },
              { name: "HYBRID", href: "/shop?type=hybrid" },
            ]
          },
          {
            title: "Value Menu",
            links: [
              { name: "CHEAP OUNCES", href: "/shop?filter=sale" },
              { name: "BUNDLE PACKS", href: "/shop?category=bundles" },
              { name: "CLEARANCE", href: "/shop?filter=clearance" },
            ]
          },
          {
            title: "Collections",
            links: [
              { name: "CRAFT CANNABIS", href: "#", icon: <FaStar size={10} className="me-1" /> },
              { name: "LIVING SOIL ORGANIC", href: "#", icon: <FaStar size={10} className="me-1" /> },
            ]
          }
        ],
        promo: {
          title: "2 OUNCES FOR $199.99",
          subtitle: "Over 10+ Strains to Choose from",
          image: "https://images.unsplash.com/photo-1628114241021-995f36e86684?q=80&w=300&auto=format&fit=crop",
          button: "SHOP NOW"
        }
      }
    },
    { 
      name: "EDIBLES", 
      href: "/shop?category=edibles", 
      isMega: true,
      megaContent: {
        categories: ["Gummies", "Hard Candy", "Chocolates", "Baked Goods", "Capsules", "Phoenix Tears", "Beverages", "Tinctures", "Pantry", "Munchies/Snacks"],
        sections: [
          {
            title: "Shop by Potency",
            links: [
              { name: "ALL EDIBLES", href: "/shop?category=edibles" },
              { name: "HIGH DOSE THC", href: "/shop?potency=high" },
              { name: "LOW DOSE THC", href: "/shop?potency=low" },
              { name: "BALANCED 1:1", href: "/shop?potency=balanced" },
              { name: "CBD EDIBLES", href: "/shop?category=cbd-edibles" },
            ]
          },
          {
            title: "Shop by Tinctures",
            links: [
              { name: "THC TINCTURES", href: "/shop?category=tinctures&sub=thc" },
              { name: "CBD TINCTURES", href: "/shop?category=tinctures&sub=cbd" },
              { name: "THC : CBD TINCTURES", href: "/shop?category=tinctures&sub=hybrid" },
            ]
          },
          {
            title: "Shop by Baked Goods",
            links: [
              { name: "COOKIES", href: "/shop?category=baked-goods&sub=cookies" },
              { name: "BROWNIES & SQUARES", href: "/shop?category=baked-goods&sub=brownies" },
            ]
          }
        ],
        promo: {
          title: "Sugar Jack's 200mg THC Gummies",
          subtitle: "Best selling edibles and for good reason!",
          image: "https://images.unsplash.com/photo-1582050041567-9cda33e4b158?q=80&w=300&auto=format&fit=crop",
          button: "SHOP NOW"
        }
      }
    },
    { 
      name: "VAPES", 
      href: "/shop?category=vapes", 
      isMega: true,
      megaContent: {
        categories: ["Vape Cartridges", "Starter Kits", "Disposable Pens", "510 Thread Batteries"],
        sections: [
          {
            title: "Shop by Potency",
            links: [
              { name: "THC", href: "/shop?category=vapes&filter=thc" },
              { name: "CBD", href: "/shop?category=vapes&filter=cbd" },
            ]
          },
          {
            title: "Value Menu",
            links: [
              { name: "BUNDLE PACK", href: "/shop?category=bundles" },
            ]
          },
          {
            title: "Top Brands",
            links: [
              { name: "HOOTI EXTRACTS", href: "/shop?brand=hooti" },
              { name: "PYRO EXTRACTS", href: "/shop?brand=pyro" },
              { name: "TOP SHELF EXTRACTS", href: "/shop?brand=top-shelf" },
            ]
          }
        ],
        promo: {
          title: "Baked Vapes 2g Variations",
          subtitle: "Baked Vapes now come in 2g variations for double the effects!",
          image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=300&auto=format&fit=crop",
          button: "SHOP NOW"
        }
      }
    },
    { 
      name: "PRE-ROLLS", 
      href: "/shop?category=pre-rolls", 
      subLinks: [
        { name: "Infused Pre-Rolls", href: "/shop?category=pre-rolls&sub=infused" },
        { name: "Dried Flower Pre-Rolls", href: "/shop?category=pre-rolls&sub=dried", hasDivider: true },
      ]
    },
    { 
      name: "EXTRACTS", 
      href: "/shop?category=extracts", 
      isMega: true,
      megaContent: {
        categories: ["Live Resin", "Shatter", "Rosin", "Crumble", "Budder", "Wax", "Terp Sauce", "THC Diamonds", "Hash", "Distillate", "Oils"],
        sections: [
          {
            title: "Concentrates",
            links: [
              { name: "ALL CONCENTRATES", href: "/shop?category=extracts" },
              { name: "SOLVENTLESS CONCENTRATES", href: "/shop?category=extracts&sub=solventless" },
              { name: "DAB RIGS & ACCESSORIES", href: "/shop?category=accessories" },
            ]
          },
          {
            title: "Value Menu",
            links: [
              { name: "CONCENTRATES BUNDLE PACKS", href: "/shop?category=bundles" },
            ]
          },
          {
            title: "Ingestible Extracts",
            links: [
              { name: "BOTTLED OILS", href: "/shop?category=extracts&sub=oils" },
              { name: "OIL SPRAYS", href: "/shop?category=extracts&sub=sprays" },
              { name: "CAPSULES", href: "/shop?category=extracts&sub=capsules" },
            ]
          }
        ],
        promo: {
          title: "Diamond Infused Blunts (High Rolla)",
          subtitle: "AAAA Flowers Infused With Frozen Kief and THC-A Diamonds",
          image: "https://images.unsplash.com/photo-1628114241021-995f36e86684?q=80&w=300&auto=format&fit=crop",
          button: "VIEW PRODUCT"
        }
      }
    },
    { 
      name: "CBD", 
      href: "/shop?category=cbd", 
      isMega: true,
      megaContent: {
        categories: ["CBD Edibles", "CBD Tinctures", "Topicals", "CBD Vapes"],
        sections: [
          {
            title: "Shop by CBD Product Type",
            links: [
              { name: "CBD CAPSULES", href: "/shop?category=cbd&sub=capsules" },
              { name: "CBD GUMMIES", href: "/shop?category=cbd&sub=gummies" },
              { name: "CBD VAPES & CONCENTRATES", href: "/shop?category=cbd&sub=vapes" },
              { name: "CBD PETS", href: "/shop?category=cbd&sub=pets" },
            ]
          },
          {
            title: "Value Menu",
            links: [
              { name: "BUNDLE PACKS", href: "/shop?category=bundles" },
            ]
          },
          {
            title: "Shop by Topical Type",
            links: [
              { name: "CREAMS AND LOTIONS", href: "/shop?category=cbd&sub=creams" },
              { name: "BATH AND SHOWER", href: "/shop?category=cbd&sub=bath" },
            ]
          },
          {
            title: "Brands",
            links: [
              { name: "CBD BLASTS", href: "/shop?brand=cbd-blasts" },
              { name: "SUGAR JACK'S", href: "/shop?brand=sugar-jacks" },
            ]
          }
        ],
        promo: {
          title: "Apex Edibles 30mg CBD Gummies",
          subtitle: "These 30mg CBD Gummies are tasty and correctly dosed for effective and easy relief!",
          image: "https://images.unsplash.com/photo-1628114241021-995f36e86684?q=80&w=300&auto=format&fit=crop",
          button: "SHOP NOW"
        }
      }
    },
    { 
      name: "ACCESSORIES", 
      href: "/shop?category=accessories", 
      subLinks: [
        { name: "Batteries", href: "/shop?category=accessories&sub=batteries" },
        { name: "Candles & Incense", href: "/shop?category=accessories&sub=candles", hasDivider: true },
        { name: "Dab Rigs", href: "/shop?category=accessories&sub=rigs", hasDivider: true },
        { name: "Dab Accessories", href: "/shop?category=accessories&sub=dab-acc", hasDivider: true },
        { name: "Grinders", href: "/shop?category=accessories&sub=grinders", hasDivider: true },
        { name: "Rolling Papers", href: "/shop?category=accessories&sub=papers", hasDivider: true },
        { name: "Rolling Trays", href: "/shop?category=accessories&sub=trays", hasDivider: true },
      ]
    },
  ];

  return (
    <>
    <header className="site-header border-bottom bg-white sticky-top">
      {/* 1. Top Bar */}
      <div className="header-top-bar d-none d-lg-block bg-light py-1 border-bottom text-uppercase">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3 text-muted">
              <a href="#" className="text-secondary opacity-75 hover-opacity-100 transition-all"><FaFacebook size={11} /></a>
              <a href="#" className="text-secondary opacity-75 hover-opacity-100 transition-all"><FaInstagram size={11} /></a>
              <a href="#" className="text-secondary opacity-75 hover-opacity-100 transition-all"><FaTwitter size={11} /></a>
              <a href="#" className="text-secondary opacity-75 hover-opacity-100 transition-all"><FaEnvelope size={11} /></a>
            </div>

            <div className="d-flex align-items-center gap-3">
              {session ? (
                <div className="dropdown">
                  <button className="btn btn-link btn-sm text-dark text-decoration-none p-0 d-flex align-items-center gap-2 dropdown-toggle shadow-none border-0 extra-small fw-700" type="button" data-bs-toggle="dropdown">
                    {session.user.name.toUpperCase()}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 small">
                    <li><Link className="dropdown-item py-2" href="/profile">My Profile</Link></li>
                    {(["ADMIN", "SUPER_ADMIN"].includes((session?.user as any)?.role)) && (
                      <li><Link className="dropdown-item py-2 text-primary" href="/admin">Admin Panel</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                  </ul>
                </div>
              ) : (
                <Link href="/register" className="text-dark text-decoration-none extra-small fw-700">Register</Link>
              )}
              <span className="text-muted opacity-50">|</span>
              <Link href="/cart" className="text-dark position-relative hover-opacity-75 transition-all">
                <FaShoppingCart size={14} />
                {mounted && cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '9px', padding: '2px 5px' }}>{cartItemCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <Link href="/" className="navbar-brand me-4">
            <div className="d-flex flex-column lh-1">
              <span className="fw-900 fs-1 text-dark m-0 p-0" style={{ letterSpacing: '-2px' }}>herb</span>
              <span className="fw-500 fs-6 text-dark m-0 p-0" style={{ letterSpacing: '2px', marginTop: '-5px' }}>approach</span>
            </div>
          </Link>

          {/* Mobile-only actions: account, cart, and the menu toggle (top bar with these is desktop-only) */}
          <div className="d-flex d-lg-none align-items-center gap-3 ms-auto">
            {session ? (
              <Link href="/profile" className="text-dark hover-opacity-75 transition-all">
                <FaUser size={16} />
              </Link>
            ) : (
              <Link href="/register" className="text-dark text-decoration-none extra-small fw-700">Register</Link>
            )}
            <Link href="/cart" className="text-dark position-relative hover-opacity-75 transition-all">
              <FaShoppingCart size={16} />
              {mounted && cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '9px', padding: '2px 5px' }}>{cartItemCount}</span>
              )}
            </Link>
            <button
              className="navbar-toggler border-0 shadow-none p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavCollapse"
              aria-controls="mainNavCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse d-lg-flex justify-content-between" id="mainNavCollapse">
            <ul className="navbar-nav align-items-center column-gap-3 mx-lg-auto">
              {navLinks.map((link) => {
                const hasSubmenu = (link.subLinks?.length ?? 0) > 0 || link.isMega;
                return (
                <li key={link.name} className={cn("nav-item position-static", hasSubmenu && "dropdown-hover", openSubmenu === link.name && "mobile-submenu-open")}>
                  <div className="d-flex align-items-center">
                    <Link
                      href={link.href}
                      className="nav-link text-dark fw-bold extra-small tracking-wider d-flex align-items-center gap-1 py-1 flex-grow-1"
                    >
                      {link.name}
                    </Link>
                    {hasSubmenu && (
                      <button
                        type="button"
                        className="btn btn-link d-lg-none p-2 text-dark shadow-none"
                        aria-expanded={openSubmenu === link.name}
                        aria-label={`Toggle ${link.name} submenu`}
                        onClick={() => setOpenSubmenu(openSubmenu === link.name ? null : link.name)}
                      >
                        <FaChevronDown size={10} className={cn("opacity-50 transition-all", openSubmenu === link.name && "rotate-180")} />
                      </button>
                    )}
                    {hasSubmenu && <FaChevronDown size={8} className="opacity-50 d-none d-lg-inline ms-1" />}
                  </div>

                  {/* MEGA MENU for Flowers */}
                  {link.isMega ? (
                    <div className="mega-menu-panel position-absolute w-100 bg-white shadow-lg border-top" style={{ left: 0 }}>
                        <div className="container py-5">
                            <div className="row">
                                {/* Left Col - Featured Categories */}
                                <div className="col-lg-3 border-end">
                                    <ul className="list-unstyled d-flex flex-column gap-3 text-end pe-5">
                                        {link.megaContent?.categories.map((cat, i) => (
                                            <li key={i}><Link href="/shop" className="text-dark text-decoration-none h6 fw-600 hover-text-primary transition-all">{cat}</Link></li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Middle Cols - Sections */}
                                <div className="col-lg-5">
                                    <div className="row g-4">
                                        {link.megaContent?.sections.map((section, idx) => (
                                            <div key={idx} className="col-6">
                                                <h6 className="fw-900 small text-dark mb-3 tracking-widest">{section.title.toUpperCase()}</h6>
                                                <ul className="list-unstyled d-flex flex-column gap-2">
                                                    {section.links.map((sub, j) => (
                                                        <li key={j}>
                                                            <Link href={sub.href} className="text-secondary small text-decoration-none d-flex align-items-center hover-text-dark fw-500">
                                                                {'icon' in sub && sub.icon}{sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Col - Promo Banner */}
                                <div className="col-lg-4">
                                    <div className="promo-card bg-light rounded-lg overflow-hidden border p-4 text-center position-relative">
                                        <div className="promo-content">
                                            <h4 className="fw-900 mb-0">{link.megaContent?.promo.title}</h4>
                                            <p className="extra-small text-muted mb-3">{link.megaContent?.promo.subtitle}</p>
                                            <img src={link.megaContent?.promo.image} className="img-fluid rounded mb-3" style={{ height: '140px', objectFit: 'cover' }} />
                                            <Link href="/shop" className="btn btn-plant w-100 fw-bold">{link.megaContent?.promo.button}</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  ) : (
                    /* REGULAR DROPDOWN */
                    (link.subLinks?.length ?? 0) > 0 && (
                        <div className="custom-dropdown-panel position-absolute start-50 translate-middle-x bg-white shadow-sm border rounded py-2 mt-0">
                            {link.subLinks?.map((sub: any, idx: number) => (
                                <div key={idx}>
                                    {sub.hasDivider && <div className="mx-0 border-top my-0 opacity-25" style={{ borderColor: '#eee' }}></div>}
                                    <Link href={sub.href} className="dropdown-item px-4 py-2 small text-secondary hover-text-dark fw-500" style={{ fontSize: '13px', minWidth: '180px' }}>{sub.name}</Link>
                                </div>
                            ))}
                        </div>
                    )
                  )}
                </li>
                );
              })}
            </ul>

            <div className="d-none d-xl-block ms-3" style={{ minWidth: '220px' }}>
              <div className="position-relative">
                <input type="text" className="form-control rounded-pill border-dark ps-3 pe-4 py-2 small" placeholder="Search.." style={{ fontSize: '0.8rem', borderColor: '#ccc' }} />
                <FaSearch className="position-absolute end-0 top-50 translate-middle-y me-3 text-dark opacity-75" size={12} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <style jsx>{`
        .dropdown-hover .custom-dropdown-panel, 
        .dropdown-hover .mega-menu-panel {
            display: none;
            z-index: 1000;
        }

        .dropdown-hover:hover .custom-dropdown-panel,
        .dropdown-hover:hover .mega-menu-panel {
            display: block;
            animation: fadeIn 0.15s ease-out;
        }

        .custom-dropdown-panel::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #fff;
            filter: drop-shadow(0 -1px 0px rgba(0,0,0,0.1));
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .rotate-180 { transform: rotate(180deg); }

        @media (max-width: 991.98px) {
            /* Hover has no effect on touch; submenus are opened via the chevron button instead */
            .dropdown-hover:hover .custom-dropdown-panel,
            .dropdown-hover:hover .mega-menu-panel {
                display: none;
            }

            .dropdown-hover.mobile-submenu-open .custom-dropdown-panel,
            .dropdown-hover.mobile-submenu-open .mega-menu-panel {
                display: block;
            }

            .mega-menu-panel,
            .custom-dropdown-panel {
                position: static;
                width: 100%;
                left: auto;
                transform: none;
                box-shadow: none;
                border: none;
                padding-left: 1rem;
            }

            .custom-dropdown-panel::before {
                display: none;
            }

            .mega-menu-panel .row > [class*="col-lg-"] {
                flex: 0 0 100%;
                max-width: 100%;
                border: none !important;
                text-align: left !important;
                padding-right: 0 !important;
            }

            /* Bootstrap's text-end/pe-5 are desktop-only choices (right-aligned column
               sitting flush against a border); they read as a broken blank gap once
               the column is stretched full-width on mobile. */
            .mega-menu-panel .text-end {
                text-align: left !important;
            }
            .mega-menu-panel .pe-5 {
                padding-right: 0 !important;
            }

            /* .navbar-nav's align-items-center is meant for the horizontal desktop bar;
               on the stacked mobile menu it centers each item instead of a normal
               left-aligned list. */
            #mainNavCollapse .navbar-nav.align-items-center {
                align-items: stretch !important;
            }

            #mainNavCollapse .nav-item {
                width: 100%;
            }
        }

        .extra-small { font-size: 11px; }
        .fw-900 { font-weight: 900; }
        .fw-600 { font-weight: 600; }
        .fw-700 { font-weight: 700; }
    `}</style>
    </>
  );
}
