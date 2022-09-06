import { Suspense, useEffect, useRef, useState } from "react";
import "./App.scss";
import i18n from "./i18n";
import Loading from "./components/Loading";
import { useTranslation } from "react-i18next";
import LocaleContext from "./LocaleContext";
import LanguagePicker from "./components/LocaleNavigator";
// import Cursor from "./components/Cursor/Cursor";
import Footer from "./components/Footer/index";
import { Bell, Coin, Logout, Settings,  User } from "tabler-icons-react";
// import { HeaderSimple } from "./components/Header";
import {
    Burger,
    ColorSchemeProvider,
    ColorScheme,
    Drawer,
    Container, Anchor, Text, Button, Menu, Loader, Indicator, Center, Box
} from "@mantine/core";
import { ActionToggle } from "./components/ThemeColor";
import { HeroContentLeft } from "./components/Hero";
import { SegmentedControl } from "@mantine/core";
// import { useWindowScroll } from '@mantine/hooks';
import { MarketHighlights } from "./components/MarketHighlights";
import Albums from "./pages/Collection";
import CardCreator from "./pages/CardCreator";
import Market from "./pages/Market";
import Login  from "./pages/Login";
import { getCookie, getUser, logout } from "./Controllers/authentication";

function App() {
    // const [scroll, scrollTo] = useWindowScroll();
    const WEBSITE_NAME = "The Card Captor"
    const [selectedPage, setSelectedPage] = useState<any>("auction");
    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    
    const [colorScheme, setColorScheme] = useState<any>("dark");
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    const [locale, setLocale] = useState(i18n.language);
    const { t } = useTranslation() as any;
    i18n.on("languageChanged", (lng) => setLocale(i18n.language));
    const [offset, setOffset] = useState(0);
    // const [menuValue, setMenuValue] = useState("auction");
    const [burgerOpened, setBurgerOpened] = useState(false);
    const [drawerOpened, setDrawerOpened] = useState(false)
    const burgerTitle = burgerOpened ? 'Close navigation' : 'Open navigation';
    
    const [menuSegmentDisabled, setMenuSegmentDisabled] = useState(false);
    
    const menuAuction = useRef(null);
    
    const [isRegistering, setIsRegistering] = useState(false);
    
    const [lang, setLang] = useState<any>(null);
    
    useEffect(() => {
        
        const langStorage = localStorage.getItem("lang");
        if (langStorage != null && langStorage != "") {
            setLang(langStorage)
        } else {
            setLang("en")
        }
        
        checkLogin();
    }, [t])
    
    const loginStatus = () => {
        
        checkLogin();
    }
    
    const tryLogout = () => {
        logout().then(res => {
            window.location.reload();
        })
    }
    
    const switchToLogin = () => {
        if (selectedPage == "login") {
            setIsRegistering(false);
            // childCompRef.current.showAlert();
        } else {
            setIsRegistering(false);
            setSelectedPage("login")
        }
    }
    
    const checkLogin = () => {
        setLoadingUser(true);
        const token = getCookie("token");
        if (token != "") {
            // HAVE
            
            getUser(token).then((res:any) => {
                
                setUser(res);
                
                let cMenu = [];
                // console.log(t("menu4"))
                cMenu.push({ value: 'login', label: ( <div></div> ), });
                cMenu.push({ label: t("menu1"), value: "auction" });
                cMenu.push({ label: t("menu2"), value: "market"})
                if (res.unlocks.album == true)
                    cMenu.push({ label: (
                        <Center>
                            <Indicator color="yellow" size={8}>
                                <Box>{t("menu3")}</Box>
                            </Indicator>
                        </Center>
                      ), value: "collection"})
                if (res.unlocks.rewards == true)
                    cMenu.push({ label: t("menu4"), value: "rewards"})
                if (res.unlocks.creator == true)
                    cMenu.push({ label: t("menu5"), value: "creator"})
                    
                setsetCustomMenu(cMenu);
                
                setLogged(true);
                
                setLoadingUser(false);
                setSelectedPage("auction");
                setMenuSegmentDisabled(false);
                
            }).catch(err => {
                setUser(null)
                setLogged(false);
                setsetCustomMenu([{
                    value: 'login',
                    label: (
                      <div style={{ pointerEvents: "none", display: "none" }}></div>
                    ),
                },
                { label: t("menu1"), value: "auction" },
                { label: t("menu2"), value: "market"}]);
                setLoadingUser(false);
            })
            
        } else {
            // DOESN'T HAVE
            setUser(null)
            setLogged(false);
            setsetCustomMenu([{
                value: 'login',
                label: (
                  <div style={{ pointerEvents: "none", display: "none" }}></div>
                ),
            },
            { label: t("menu1"), value: "auction" },
            { label: t("menu2"), value: "market"}]);
            setLoadingUser(false);
            // console.log("Não tem");
        }
        
        // menus()
    }
    const ChangeNavItem = (item:any, menu:string) => {
        setMenuSegmentDisabled(false);
        
        if (item.target.classList.contains("active")) return
        
        document.querySelectorAll(".navbar-item").forEach(item => {
            item.classList.remove("active")
        })
        
        item.target.classList.add("active");
        setDrawerOpened(false);
        setBurgerOpened(false);
        setSelectedPage(menu);
    }
    
    const [customMenu, setsetCustomMenu] = useState([{
        value: 'login',
        label: (
          <div style={{ pointerEvents: "none", display: "none" }}></div>
        ),
    },
    { label: "Auction", value: "auction" },
    { label: "Market", value: "market"}]);
    
    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <LocaleContext.Provider value={{ locale, setLocale }}>
                <Suspense fallback={<Loading />}>
                    
                    <div
                        className="App"
                    >
                        {/* <Cursor/> */}
                        <Drawer
                            className={
                                colorScheme == "light"
                                    ? "drawer light"
                                    : "drawer dark"
                            }
                            opened={drawerOpened}
                            onClose={() => {setDrawerOpened(false); setBurgerOpened(false)}}
                            title={WEBSITE_NAME}
                            padding="xl"
                            size="md"
                        >
                            
                            <div className="drawer-settings">
                                
                                <ActionToggle />
                                
                                {
                                    lang != null ?
                                        <LanguagePicker lang={lang} />
                                    : null
                                }
                                
                            </div>
                            
                            <div className="navbar">
                                
                                <Anchor ref={menuAuction} target="" underline={false} className={selectedPage == "auction" ? "navbar-item active" : "navbar-item"} onClick={(e:any) => ChangeNavItem(e, "auction")}>
                                    Auction
                                </Anchor>
                                
                                <Anchor target="" underline={false} className={selectedPage == "market" ? "navbar-item active" : "navbar-item"} onClick={(e:any) => ChangeNavItem(e, "market")}>
                                    Market
                                </Anchor>
                                
                                {
                                    user != null && user.unlocks.album == true ?
                                    <Anchor target="" underline={false} className={selectedPage == "collection" ? "navbar-item active" : "navbar-item"} onClick={(e:any) => ChangeNavItem(e, "collection")}>
                                        My Album
                                    </Anchor>
                                    : null
                                }
                                
                                {
                                    user != null && user.unlocks.rewards == true ?
                                    <Anchor target="" underline={false} className={selectedPage == "rewards" ? "navbar-item active" : "navbar-item"} onClick={(e:any) => ChangeNavItem(e, "rewards")}>
                                        Rewards
                                    </Anchor>
                                    : null
                                }
                                
                                {
                                    user != null && user.unlocks.creator == true ?
                                    <Anchor target="" underline={false} className={selectedPage == "creator" ? "navbar-item active" : "navbar-item"} onClick={(e:any) => ChangeNavItem(e, "creator")}>
                                        Card creator
                                    </Anchor>
                                    : null
                                }
                                
                            </div>
                            
                        </Drawer>

                        <div
                            className={
                                colorScheme == "light"
                                    ? "header light"
                                    : "header dark"
                            }
                        >
                        
                            <div className="header-left">
                                <Burger
                                    color={
                                        colorScheme == "light"
                                            ? "black"
                                            : "white"
                                    }
                                    className="burger"
                                    opened={burgerOpened}
                                    onClick={() => {setBurgerOpened((o) => !o); setDrawerOpened(!burgerOpened) }}
                                    title={burgerTitle}
                                />
                            </div>
                            
                            
                            <Container className="menu-wraper" fluid>
                                
                                <SegmentedControl
                                    value={selectedPage}
                                    onChange={(e) => {setSelectedPage(e); setMenuSegmentDisabled(false)}}
                                    defaultValue="auction"
                                    // value="auction"
                                    className={
                                        colorScheme == "light"
                                            ? `menu light ${menuSegmentDisabled ? "disabled" : null}`
                                            : `menu dark ${menuSegmentDisabled ? "disabled" : null}`
                                    }
                                    color={colorScheme == "dark" ? "" : "dark"}
                                    data={ customMenu }
                                />
                                
                                    <div className="user-menu">
                                        {
                                        logged && user ?
                                        <Indicator color="yellow" size={12} label="New card">
                                            <Menu shadow="md" width={200}>
                                                <Menu.Target>
                                                    <Button className={colorScheme == "dark" ? "user-controller dark" : "user-controller light"} color="dark" sx={(theme) =>({ boxShadow: theme.shadows.sm })}>
                                                        <div className="user-controller-content">
                                                            <div className="user-name">{user.username}</div>
                                                            <div className="user-currency">
                                                                <Coin width={20} style={{ fontSize: 10 }}/>
                                                                <div className="user-balance">{user.coins}</div>
                                                            </div>
                                                        </div>
                                                    </Button>
                                                </Menu.Target>

                                                <Menu.Dropdown>
                                                    <Menu.Item>
                                                        <Indicator color="yellow" size={12} disabled position="middle-end">
                                                                <div className="user-menu-item">
                                                                    <Bell size={18}/> {t("userMenu1")}
                                                                </div>
                                                        </Indicator>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <div className="user-menu-item">
                                                            <User  size={18}/> {t("userMenu2")}
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <div className="user-menu-item">
                                                            <Settings size={18}/> {t("userMenu3")}
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item  color="red">
                                                        <div className="user-menu-item" onClick={tryLogout}>
                                                            <Logout size={18}/> {t("userMenu4")}
                                                        </div>
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                                
                                            </Menu>
                                        </Indicator>
                                        :
                                        
                                            loadingUser ?
                                                <Loader size={30} color="gray"/> :
                                                <Button variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} onClick={() => {switchToLogin(); setMenuSegmentDisabled(true) }}>{t("loginButton")}</Button>
                                        }
                                    </div>
                                                        
                            </Container>
                            
                            
                            <div className="header-right">
                                <ActionToggle />
                                
                                <LanguagePicker lang={lang} />
                            </div>
                            
                        </div>
                        
                        {
                            selectedPage == "auction" ?
                            <>
                                <HeroContentLeft switchToLogin={switchToLogin} user={user} theme={colorScheme} setIsRegistering={setIsRegistering} setSelectedPage={setSelectedPage} />

                                    <div
                                        className={
                                            colorScheme == "light"
                                                ? "market-highlights light"
                                                : "market-highlights dark"
                                        }
                                    >
                                        
                                        <Container className="market-highlights-container" size="xl" px="lg">
                                            
                                            <div className="market-highlights-header">
                                                <Text variant="gradient" className="title" align="left" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}>
                                                    {t("main1")}
                                                </Text>
                                                <Button onClick={() => { setSelectedPage("market") }} variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} sx={(theme) => ({ boxShadow: theme.shadows.sm })}>{t("menu2")}</Button>
                                            </div>
                                            
                                            <MarketHighlights/>
                                            
                                        </Container>
                                        
                                    </div>
                                </>
                            : null
                        }
                        
                        {
                            selectedPage == "market" ?
                            <Market user={user}/>
                            : null
                        }
                        
                        {
                            selectedPage == "collection" ?
                            <Albums user={user}/>
                            : null
                        }
                        
                        {
                            selectedPage == "creator" ?
                            <CardCreator user={user}/>
                            : null
                        }
                        
                        {
                            selectedPage == "login" ?
                            <Login loginStatus={loginStatus} isRegistering={isRegistering} setIsRegistering={setIsRegistering}/>
                            
                            : null
                        }

                        <Footer
                            data={[
                                {
                                    title: "Useful links",
                                    links: [
                                        {
                                            label: "About us",
                                            link: "https://google.com",
                                        },
                                        {
                                            label: "Privacy policy",
                                            link: "https://google.com",
                                        },
                                        {
                                            label: "Contact us",
                                            link: "https://google.com",
                                        },
                                        {
                                            label: "Copiright information",
                                            link: "https://google.com",
                                        },
                                    ],
                                },
                            ]}
                        />
                            
                    </div>
                </Suspense>
            </LocaleContext.Provider>
        </ColorSchemeProvider>
    );
}

export default App;
