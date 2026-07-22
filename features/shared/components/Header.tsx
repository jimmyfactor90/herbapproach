"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FaSearch, FaUser, FaShoppingCart, FaFacebook, FaInstagram, FaTwitter, FaChevronDown, FaEnvelope, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCartStore } from "@/features/cart/store/cart.store";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  children: { id: string; name: string; slug: string }[];
}

interface HeaderProps {
  categories: CategoryNode[];
}

export default function Header({ categories }: HeaderProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Matches herbapproach.com's nav order (Flowers, Edibles, Vapes, Pre-Rolls, Extracts, CBD, Accessories)
  const CATEGORY_ORDER = ["flowers", "edibles", "vapes", "pre-rolls", "concentrates", "cbd", "accessories"];
  const orderedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug)
  );

  // Rich mega-menu content matching herbapproach.com, keyed by category slug.
  // Categories not listed here fall back to a plain dropdown built from their DB subcategories.
  const MEGA_MENUS: Record<string, {
    categories: string[];
    sections: { title: string; links: { name: string; href: string; icon?: React.ReactNode }[] }[];
  }> = {
    flowers: {
      categories: ["Dried Flower", "Pre-Rolls", "Moon Rocks"],
      sections: [
        {
          title: "Plant Type",
          links: [
            { name: "INDICA", href: "/shop?strainType=INDICA" },
            { name: "SATIVA", href: "/shop?strainType=SATIVA" },
            { name: "HYBRID", href: "/shop?strainType=HYBRID" },
          ],
        },
        {
          title: "Value Menu",
          links: [
            { name: "CHEAP OUNCES", href: "/shop?filter=sale" },
            { name: "BUNDLE PACKS", href: "/shop?category=bundles" },
            { name: "CLEARANCE", href: "/shop?filter=clearance" },
          ],
        },
        {
          title: "Collections",
          links: [
            { name: "CRAFT CANNABIS", href: "#", icon: <FaStar size={10} className="me-1" /> },
            { name: "LIVING SOIL ORGANIC", href: "#", icon: <FaStar size={10} className="me-1" /> },
          ],
        },
      ],
    },
    edibles: {
      categories: ["Gummies", "Hard Candy", "Chocolates", "Baked Goods", "Capsules", "Phoenix Tears", "Beverages", "Tinctures", "Pantry", "Munchies/Snacks"],
      sections: [
        {
          title: "Shop by Potency",
          links: [
            { name: "ALL EDIBLES", href: "/shop?category=edibles" },
            { name: "HIGH DOSE THC", href: "/shop?category=edibles&potency=HIGH_THC" },
            { name: "LOW DOSE THC", href: "/shop?category=edibles&potency=LOW_THC" },
            { name: "BALANCED 1:1", href: "/shop?category=edibles&potency=BALANCED" },
            { name: "CBD EDIBLES", href: "/shop?category=cbd-edibles" },
          ],
        },
        {
          title: "Shop by Tinctures",
          links: [
            { name: "THC TINCTURES", href: "/shop?category=edibles-tinctures" },
            { name: "CBD TINCTURES", href: "/shop?category=cbd-tinctures" },
            { name: "THC : CBD TINCTURES", href: "/shop?category=edibles-tinctures&potency=BALANCED" },
          ],
        },
        {
          title: "Shop by Baked Goods",
          links: [
            { name: "COOKIES", href: "/shop?category=edibles-baked-goods" },
            { name: "BROWNIES & SQUARES", href: "/shop?category=edibles-baked-goods" },
          ],
        },
      ],
    },
    vapes: {
      categories: ["Vape Cartridges", "Starter Kits", "Disposable Pens", "510 Thread Batteries"],
      sections: [
        {
          title: "Shop by Potency",
          links: [
            { name: "THC", href: "/shop?category=vapes&potency=HIGH_THC" },
            { name: "CBD", href: "/shop?category=vapes&potency=CBD" },
          ],
        },
        {
          title: "Value Menu",
          links: [
            { name: "BUNDLE PACK", href: "/shop?category=bundles" },
          ],
        },
        {
          title: "Top Brands",
          links: [
            { name: "HOOTI EXTRACTS", href: "#" },
            { name: "PYRO EXTRACTS", href: "#" },
            { name: "TOP SHELF EXTRACTS", href: "#" },
          ],
        },
      ],
    },
    concentrates: {
      categories: ["Live Resin", "Shatter", "Rosin", "Crumble", "Budder", "Wax", "Terp Sauce", "THC Diamonds", "Hash", "Distillate", "Oils"],
      sections: [
        {
          title: "Concentrates",
          links: [
            { name: "ALL CONCENTRATES", href: "/shop?category=concentrates" },
            { name: "SOLVENTLESS CONCENTRATES", href: "/shop?category=concentrates-rosin" },
            { name: "DAB RIGS & ACCESSORIES", href: "/shop?category=accessories-dab-rigs" },
          ],
        },
        {
          title: "Value Menu",
          links: [
            { name: "CONCENTRATES BUNDLE PACKS", href: "/shop?category=bundles" },
          ],
        },
        {
          title: "Ingestible Extracts",
          links: [
            { name: "BOTTLED OILS", href: "#" },
            { name: "OIL SPRAYS", href: "#" },
            { name: "CAPSULES", href: "#" },
          ],
        },
      ],
    },
    cbd: {
      categories: ["CBD Edibles", "CBD Tinctures", "Topicals", "CBD Vapes"],
      sections: [
        {
          title: "Shop by CBD Product Type",
          links: [
            { name: "CBD CAPSULES", href: "#" },
            { name: "CBD GUMMIES", href: "#" },
            { name: "CBD VAPES & CONCENTRATES", href: "/shop?category=cbd-vapes" },
            { name: "CBD PETS", href: "#" },
          ],
        },
        {
          title: "Value Menu",
          links: [
            { name: "BUNDLE PACKS", href: "/shop?category=bundles" },
          ],
        },
        {
          title: "Shop by Topical Type",
          links: [
            { name: "CREAMS AND LOTIONS", href: "/shop?category=cbd-topicals" },
            { name: "BATH AND SHOWER", href: "#" },
          ],
        },
        {
          title: "Brands",
          links: [
            { name: "CBD BLASTS", href: "#" },
            { name: "SUGAR JACK'S", href: "#" },
          ],
        },
      ],
    },
  };

  const navLinks = [
    { name: "VALUE MENU", href: "/shop", subLinks: [] as { name: string; href: string }[], isMega: false, megaContent: undefined },
    {
      name: "FLASH DEALS",
      href: "/shop?filter=flash",
      subLinks: [
        { name: "Flash Deals", href: "/shop?filter=flash" },
        { name: "Ounce Deals", href: "/shop?category=flowers&weight=ounce" },
        { name: "New Arrivals", href: "/shop?filter=new" },
        { name: "Bundle Packs", href: "/shop?category=bundles" },
        { name: "Clearance", href: "/shop?filter=clearance" },
      ],
      isMega: false,
      megaContent: undefined,
    },
    ...orderedCategories.map((cat) => {
      const megaConfig = MEGA_MENUS[cat.slug];
      const mega = megaConfig ? { ...megaConfig, image: cat.image } : undefined;
      return {
        name: cat.name.toUpperCase(),
        href: `/shop?category=${cat.slug}`,
        subLinks: mega
          ? []
          : cat.children.map((child) => ({
              name: child.name,
              href: `/shop?category=${child.slug}`,
            })),
        isMega: !!mega,
        megaContent: mega,
      };
    }),
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
                const hasSubmenu = link.subLinks.length > 0 || link.isMega;
                return (
                <li key={link.name} className={cn("nav-item", link.isMega ? "position-static" : "position-relative", hasSubmenu && "dropdown-hover", openSubmenu === link.name && "mobile-submenu-open")}>
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

                  {link.isMega && link.megaContent ? (
                    <div className="mega-menu-panel position-absolute w-100 bg-white shadow-lg border-top" style={{ left: 0 }}>
                        <div className="container py-5">
                            <div className="row">
                                {/* Left Col - Featured Categories */}
                                <div className="col-lg-3 border-end">
                                    <ul className="list-unstyled d-flex flex-column gap-3 text-end pe-5">
                                        {link.megaContent.categories.map((cat, i) => (
                                            <li key={i}><Link href="/shop" className="text-dark text-decoration-none h6 fw-600 hover-text-primary transition-all">{cat}</Link></li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Middle Cols - Sections */}
                                <div className="col-lg-5">
                                    <div className="row g-4">
                                        {link.megaContent.sections.map((section, idx) => (
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

                                {/* Right Col - Category Image (top-aligned when the menu is tall, centered when it's short) */}
                                <div className={cn("col-lg-4 d-flex", link.megaContent.categories.length > 5 ? "align-items-start" : "align-items-center")}>
                                    <Link href={link.href} className="d-block rounded-lg overflow-hidden border position-relative mx-auto w-100" style={{ aspectRatio: '1 / 1', maxWidth: '220px' }}>
                                        {link.megaContent.image ? (
                                            <img src={link.megaContent.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={link.name} />
                                        ) : (
                                            <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                                                No image set
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                  ) : hasSubmenu && (
                    <div className="custom-dropdown-panel position-absolute start-50 translate-middle-x bg-white shadow-sm border rounded py-2 mt-0">
                        {link.subLinks.map((sub, idx) => (
                            <Link
                              key={idx}
                              href={sub.href}
                              className={cn("dropdown-item px-4 py-2 small text-secondary hover-text-dark fw-500 d-block", idx > 0 && "border-top")}
                              style={{ fontSize: '13px', minWidth: '180px', borderColor: '#eee' }}
                            >
                              {sub.name}
                            </Link>
                        ))}
                    </div>
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
