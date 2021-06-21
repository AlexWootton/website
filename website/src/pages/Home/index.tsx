import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import useStyles from './styles';
import Paper from '@material-ui/core/Paper';
import { Typography, Link, Tabs, Tab, Box, Button, Tooltip, IconButton, withStyles } from '@material-ui/core';
import Footer from '../../components/Footer';
import JoinCommunity from '../../components/JoinCommunity';
import Newsletter from "../../components/Newsletter";
import Sponsor from "../../components/Sponsor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { EXTERNAL_LINKS, VIEW_PORT } from '../../constants';
import Asciinema from '../../components/Asciinema';
import MiniBlog from '../../components/MiniBlog';
import adopterData from "../../adopters.md";
import EventSlider from '../../components/EventSlider';
import events from '../../resources/events.json';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useViewport } from "../../hooks/viewportWidth";


const Home: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState<number>(0);
    const [adopterTestimonials, setAdopterTestimonials] = useState<any>("");
    const [copyCommand, setCopyCommand] = useState({
        text: 'helm install stable/openebs --name openebs --namespace openebs',
        status: 'Copy to clipboard'
    });

    const handleTabChange = (_event: React.ChangeEvent<{}>, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    const [isMobileView, setIsMobileView] = useState<boolean>(false);
    const [isTabletView, setIsTabletView] = useState<boolean>(false);
    const { width } = useViewport();
    useEffect(()=>{
        window.innerWidth <= VIEW_PORT.MOBILE_BREAKPOINT ? setIsMobileView(true) : setIsMobileView(false);
        window.innerWidth <= VIEW_PORT.LAPTOP_BREAKPOINT ? setIsTabletView(true) : setIsTabletView(false);
    },[width])
    // const [logoSlidesPerScreen, setLogoSlidesPerScreen] = useState<number>(6);

    //function to fecth all the adoters testimonials

    useEffect(()=>{
        fetchAdoptersTestimonials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchAdoptersTestimonials = async () => {
        await fetch(adopterData).then((response) => {
         if (response.ok) {
             return response.text();
         }
         else {
             return Promise.reject(t('adoptersTestimonials.rejectDatainfo'));
         }
       }).then((text) => {
         const testimonials = require("mdtable2json").getTables(text);
         setAdopterTestimonials(testimonials[0].json);
       })
       .catch((err) => console.error(err));
     };
    
    // logoSliderSettings for logos carousel
    var logoSliderSettings = {
        dots: false,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        cssEase: "linear",
        arrows: false,
    };
    
    interface TabPanelProps {
        children?: React.ReactNode;
        index: any;
        value: any;
    }
      
    function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box p={0}>
            <div>{children}</div>
            </Box>
        )}
        </div>
    );
    }
      
    function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
    }

    

    // function to override tooltip component default style
    const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.success.dark,
        color: theme.palette.background.paper,
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 400
    },
    }))(Tooltip);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(copyCommand.text)
        setCopyCommand({
            text: 'helm install stable/openebs --name openebs --namespace openebs',
            status: 'Copied to clipboard'})
        setTimeout(() => {
            setCopyCommand({
                text: 'helm install stable/openebs --name openebs --namespace openebs',
                status:'Copy to clipboard'})
        }, 2000);
    };

    // Installation
    const storageProviders = {
        Redis : {
            logo: "../images/logos/redis.svg",
            white_logo: "../images/logos/redis_white.svg"
        },
        Minio : {
            logo: "../images/logos/minio.svg",
            white_logo: "../images/logos/minio_white.svg"
        },
        Percona : {
            logo: "../images/logos/percona.svg",
            white_logo: "../images/logos/percona_white.svg"
        },
        MongoDB : {
            logo: "../images/logos/mongodb.svg",
            white_logo: "../images/logos/mongodb_white.svg"
        },
        Prometheus : {
            logo: "../images/logos/prometheus.svg",
            white_logo: "../images/logos/prometheus_white.svg"
        },
        MySQL : {
            logo: "../images/logos/mysql.svg",
            white_logo: "../images/logos/mysql_white.svg"
        }
    };

    const defaultInstallationButtonStatus: any = {
        Redis : {
            status: false,
            src: 'casts/redis.cast'
        },
        Minio : {
            status: false,
            src: 'casts/minio.cast'
        },
        Percona : {
            status: false,
            src: 'casts/percona.cast'
        },
        MongoDB : {
            status: false,
            src: 'casts/mongodb.cast'
        },
        Prometheus : {
            status: false,
            src: 'casts/prometheus.cast'
        },
        MySQL : {
            status: false,
            src: 'casts/mysql.cast'
        },
    };

    
    const [installationButtonStatus, setInstallationButtonStatus] = useState({
        ...defaultInstallationButtonStatus,
        MySQL : {
            ...defaultInstallationButtonStatus.MySQL,
            status: true
        }, // setting MySQL selected by default
    });

    const [asciinemaFileSrc, setAsciinemaFileSrc]= useState('casts/mysql.cast');  // setting MySQL selected by default
    const [asciinemaTitle, setAsciinemaTitle]= useState('MySQL');  // setting MySQL selected by default
    const displayProviderInstallation = (provider: string) => {
        setInstallationButtonStatus({
            ...defaultInstallationButtonStatus,
            [provider]: {
                ...defaultInstallationButtonStatus[provider],
                status: true
            }
        });
        setAsciinemaFileSrc(defaultInstallationButtonStatus[provider].src);
        setAsciinemaTitle(provider);
    };

    const NextArrow = (props:any) => {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
          ><img loading="lazy" src="../images/svg/right_arrow.svg" alt={t('home.adaptorsTestimonials.nextArrowAlt')} /></div>
        );
      }
      
    const PrevArrow = (props:any) => {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
          ><img loading="lazy" src="../images/svg/left_arrow.svg" alt={t('home.adaptorsTestimonials.previousArrowAlt')} /></div>
        );
    }
    
    const testimonialSliderSettings = {
        dots:false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed:500,
        slidesToShow:1,
        slidesToScroll: 1,
        cssEase:"linear",
        arrows:true,
        centerMode:true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        className:classes.testimonialCarousel,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                  arrows: false,
                  swipeToSlide: true,
                },
              },
        ]
    }
    
    return (
        <div>
            <section>
                {isMobileView ? 
                    <Grid container spacing={0}>
                        <Grid item sm={8} xs={11} className={classes.firstGrid}>
                            <Paper className={[classes.paper,classes.firstPaper].join(' ')}>
                                <Typography variant='h1' className={classes.firstSectionTitle}>
                                    {t('home.landingScreenTitle')}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item sm={4} xs={1}>
                            <Paper className={[classes.paper, classes.secondGrid].join(' ')}>
                                <img loading="lazy" placeholder={"../images/png/homepage_main.png?q=20"} src="../images/png/homepage_main.png?q=20" alt={t('home.landingScreenImageAlt')} className={classes.landingImage}></img>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={[classes.paper,classes.tabsWrapper].join(' ')}>
                                    <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{style: {display: "none"}}}>
                                        <Tab label={t('home.openebs.label')} {...a11yProps(0)} className={classes.tabButton}/>
                                        <Tab label={t('home.concepts.label')} {...a11yProps(1)} className={classes.tabButton}/>
                                        <Tab label={t('home.community.label')} {...a11yProps(2)} className={classes.tabButton}/>
                                    </Tabs>
                                    <TabPanel value={tabValue} index={0} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.openebs.description')} 
                                        </Typography>
                                        <Button variant="contained" color="secondary" className={classes.solidButton} href={EXTERNAL_LINKS.OPENEBS_GET_STARTED} target="_blank">
                                            {t('home.openebs.runOpenEBS')} 
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            endIcon={<img loading="lazy" src="../images/svg/play.svg" alt={t('home.openebs.watchDemo')}></img>}
                                            className={classes.outlineButton}
                                            href={EXTERNAL_LINKS.OPENEBS_YOUTUBE_INTRO} target="_blank"
                                        >
                                        {t('home.openebs.watchDemo')}
                                        </Button>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.concepts.description')}
                                        </Typography>
                                        <Button variant="contained" color="secondary" className={classes.solidButton} href={EXTERNAL_LINKS.OPENEBS_CONCEPTS} target="_blank">
                                            {t('home.concepts.checkConcepts')}
                                        </Button>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.community.description')}
                                        </Typography>
                                        <Button variant="contained" 
                                        color="secondary" 
                                        className={classes.solidButton}
                                        endIcon={<img loading="lazy" src="../images/logos/slack_white.svg" alt={t('home.community.joinOnSlack')}></img>}
                                        href="/community">
                                            {t('home.community.joinOnSlack')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            endIcon={<img loading="lazy" src="../images/logos/github_orange.svg" alt={t('home.community.joinOnGitHub')}></img>}
                                            className={classes.outlineButton}
                                            href={EXTERNAL_LINKS.OPENEBS_GITHUB_REPO} target="_blank"
                                        >
                                        {t('home.community.joinOnGitHub')}
                                        </Button>
                                    </TabPanel>
                            </Paper>
                        </Grid>
                    </Grid> 

                :

                    <Grid container spacing={0}>
                            <Grid item lg={6} md={7} sm={8} className={classes.firstGrid}>
                                <Paper className={[classes.paper,classes.firstPaper].join(' ')}>
                                    <Typography variant='h1' className={classes.firstSectionTitle}>
                                        {t('home.landingScreenTitle')}
                                    </Typography>

                                    <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{style: {display: "none"}}}>
                                        <Tab label={t('home.openebs.label')} {...a11yProps(0)} className={classes.tabButton}/>
                                        <Tab label={t('home.concepts.label')} {...a11yProps(1)} className={classes.tabButton}/>
                                        <Tab label={t('home.community.label')} {...a11yProps(2)} className={classes.tabButton}/>
                                    </Tabs>
                                    <TabPanel value={tabValue} index={0} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.openebs.description')} 
                                        </Typography>
                                        <Button variant="contained" color="secondary" className={classes.solidButton} href={EXTERNAL_LINKS.OPENEBS_GET_STARTED} target="_blank">
                                            {t('home.openebs.runOpenEBS')} 
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            endIcon={<img loading="lazy" src="../images/svg/play.svg" alt={t('home.openebs.watchDemo')}></img>}
                                            href={EXTERNAL_LINKS.OPENEBS_YOUTUBE_INTRO} target="_blank"
                                        >
                                        {t('home.openebs.watchDemo')}
                                        </Button>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.concepts.description')}
                                        </Typography>
                                        <Button variant="contained" color="secondary" className={classes.solidButton} href={EXTERNAL_LINKS.OPENEBS_CONCEPTS} target="_blank">
                                            {t('home.concepts.checkConcepts')}
                                        </Button>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2} >
                                        <Typography className={classes.tabBodyText}>
                                            {t('home.community.description')}
                                        </Typography>
                                        <Button variant="contained" 
                                        color="secondary" 
                                        className={classes.solidButton}
                                        endIcon={<img loading="lazy" src="../images/logos/slack_white.svg" alt={t('home.community.joinOnSlack')}></img>}
                                        href="/community">
                                            {t('home.community.joinOnSlack')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            endIcon={<img loading="lazy" src="../images/logos/github_orange.svg" alt={t('home.community.joinOnGitHub')}></img>}
                                            href={EXTERNAL_LINKS.OPENEBS_GITHUB_REPO} target="_blank"
                                        >
                                        {t('home.community.joinOnGitHub')}
                                        </Button>
                                    </TabPanel>
                                </Paper>
                            </Grid>
                            <Grid item lg={6} md={5} sm={4}>
                                <Paper className={classes.paper}>
                                    <span className={classes.landingImage}>
                                        <LazyLoadImage effect="blur" src={"../images/png/homepage_main.png"} alt={t('home.landingScreenImageAlt')}  />                                 
                                    </span>
                                </Paper>
                            </Grid>
                        </Grid>
                }
            </section>


            <section>
                <Slider {...logoSliderSettings} className={classes.logoCarousel}>
                    <div>
                        <img loading="lazy" src="../images/logos/bloomberg_blue.png" alt={t('home.usedInProductionBy.bloomberg')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/arista_blue.png" alt={t('home.usedInProductionBy.arista')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/orange_blue.png" alt={t('home.usedInProductionBy.orange')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/optoro_blue.png" alt={t('home.usedInProductionBy.optoro')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/comcast_blue.png" alt={t('home.usedInProductionBy.comcast')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/bloomberg_blue.png" alt={t('home.usedInProductionBy.bloomberg')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/arista_blue.png" alt={t('home.usedInProductionBy.arista')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/orange_blue.png" alt={t('home.usedInProductionBy.orange')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/optoro_blue.png" alt={t('home.usedInProductionBy.optoro')} />
                    </div>
                    <div>
                        <img loading="lazy" src="../images/logos/comcast_blue.png" alt={t('home.usedInProductionBy.comcast')} />
                    </div>
                </Slider>
            </section>

            <section>
                <Sponsor/>
            </section>

            <section>
                <Typography variant="h2" className={classes.sectionTitle}>
                    {t('home.whatsInItForYou.title')}
                </Typography>
                <Grid container spacing={3} className={classes.sectionDiv}>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/money_bag.svg" alt={t('home.whatsInItForYou.saveMoney')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.saveMoney')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/box.svg" alt={t('home.whatsInItForYou.flexibility')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.flexibility')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/wheel.svg" alt={t('home.whatsInItForYou.resilience')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.resilience')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/cloud.svg" alt={t('home.whatsInItForYou.restoreData')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.restoreData')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/lock.svg" alt={t('home.whatsInItForYou.openSource')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.openSource')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <Paper className={[classes.paper, classes.iconTextContainer].join(' ')}>
                            <div className={classes.iconHolder}>
                                <img loading="lazy" src="../images/svg/settings.svg" alt={t('home.whatsInItForYou.granularControl')}></img>
                            </div>
                            <Typography className={classes.description}>
                                {t('home.whatsInItForYou.granularControl')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </section>


            <section>
                <div className={classes.installationDiv}>
                    <Typography variant="h2" className={classes.sectionTitle}>
                        {t('home.installation.title')}
                    </Typography>
                    <Typography variant="h5" className={classes.sectionSubTitle}>
                        {t('home.installation.description')} 
                    </Typography>
                    <Box className={classes.codeWrapper} mt={2}>
                        <Box className={classes.codeBlock} paddingX={2}>
                            <Typography variant="h5" className={classes.codeText}>
                                {copyCommand.text}
                            </Typography>
                            <LightTooltip title={copyCommand.status}>
                                <Link onClick={copyToClipboard} className={`${classes.copyIcon} ${classes.imageFluid}`}>
                                    <img loading="lazy" src="../images/svg/copy.svg" alt={copyCommand.status} />
                                </Link>
                            </LightTooltip>
                        </Box >
                    </Box>
                    <Typography className={classes.orSeparatorText}>
                        {t('home.installation.or')}
                    </Typography>
                    <Button variant="contained" color="secondary" className={[classes.solidButton,classes.middleButton].join(' ')} href={EXTERNAL_LINKS.OPENEBS_INSTALLATION_GUIDE} target="_blank">
                        {t('home.installation.readTheGuide.button')}
                    </Button>
                    <div className={classes.installationDescriptionWrapper}>
                        <Typography className={classes.installationDescription}>
                            {t('home.installation.readTheGuide.descriptionPart1')}
                        </Typography>
                        <Typography className={classes.installationDescription}>
                            {t('home.installation.readTheGuide.descriptionPart2')}
                        </Typography>
                    </div>
                    
                    <div>
                        {isTabletView ? 
                            <div className={classes.installationCodeWrapper}>

                                <Paper className={[classes.paper, classes.desktopCommandWrapper].join(' ')}>
                                    <img loading="lazy" src="../images/png/homepage_desktop.png" alt={t('home.installation.desktopImgAlt')} className={classes.desktopImage}></img>
                                    <div className={classes.installationProviderCommandWrapper}>
                                        <Typography className={classes.installationProvider}>
                                            {asciinemaTitle}
                                        </Typography>
                                        <Asciinema  src={asciinemaFileSrc} />
                                    </div>
                                </Paper>

                                <div className={classes.installationButtonDiv}>
                                    <Paper className={[classes.paper, classes.installationButtonsWrapper].join(' ')}>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Redis.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.Redis.status ? storageProviders.Redis.white_logo : storageProviders.Redis.logo} alt={t('home.installation.redis')}></img>}
                                            onClick={() => displayProviderInstallation('Redis')}>
                                            {t('home.installation.redis')}
                                        </Button>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Minio.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.Minio.status ? storageProviders.Minio.white_logo :storageProviders.Minio.logo} alt={t('home.installation.minio')}></img>}
                                            onClick={() => displayProviderInstallation('Minio')}>
                                            {t('home.installation.minio')}
                                        </Button>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Percona.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.Percona.status ? storageProviders.Percona.white_logo : storageProviders.Percona.logo} alt={t('home.installation.percona')}></img>}
                                            onClick={() => displayProviderInstallation('Percona')}>
                                            {t('home.installation.percona')}
                                        </Button>
                                    </Paper>

                                    <Paper className={[classes.paper, classes.installationButtonsWrapper].join(' ')}>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.MongoDB.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.MongoDB.status ? storageProviders.MongoDB.white_logo : storageProviders.MongoDB.logo} alt={t('home.installation.mongodb')}></img>}
                                            onClick={() => displayProviderInstallation('MongoDB')}>
                                            {t('home.installation.mongodb')}
                                        </Button>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.Prometheus.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.Prometheus.status ? storageProviders.Prometheus.white_logo : storageProviders.Prometheus.logo} alt={t('home.installation.prometheus')}></img>}
                                            onClick={() => displayProviderInstallation('Prometheus')}>
                                            {t('home.installation.prometheus')}
                                        </Button>
                                        <Button variant="contained" 
                                            className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.MySQL.status ? classes.installationButtonActive : ''].join(' ')}
                                            startIcon={<img loading="lazy" src={installationButtonStatus.MySQL.status ? storageProviders.MySQL.white_logo : storageProviders.MySQL.logo} alt={t('home.installation.mysql')}></img>}
                                            onClick={() => displayProviderInstallation('MySQL')}>
                                            {t('home.installation.mysql')}
                                        </Button>
                                    </Paper>
                                </div>                                
                            </div>

                        :

                            <div className={classes.installationCodeWrapper}>
                                <Paper className={[classes.paper, classes.installationButtonsWrapper].join(' ')}>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Redis.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.Redis.status ? storageProviders.Redis.white_logo : storageProviders.Redis.logo} alt={t('home.installation.redis')}></img>}
                                        onClick={() => displayProviderInstallation('Redis')}>
                                        {t('home.installation.redis')}
                                    </Button>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Minio.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.Minio.status ? storageProviders.Minio.white_logo :storageProviders.Minio.logo} alt={t('home.installation.minio')}></img>}
                                        onClick={() => displayProviderInstallation('Minio')}>
                                        {t('home.installation.minio')}
                                    </Button>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationLeftButton, installationButtonStatus.Percona.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.Percona.status ? storageProviders.Percona.white_logo : storageProviders.Percona.logo} alt={t('home.installation.percona')}></img>}
                                        onClick={() => displayProviderInstallation('Percona')}>
                                        {t('home.installation.percona')}
                                    </Button>
                                </Paper>

                                <Paper className={[classes.paper, classes.desktopCommandWrapper].join(' ')}>
                                    <img loading="lazy" src="../images/png/homepage_desktop.png" alt={t('home.installation.desktopImgAlt')} className={classes.desktopImage}></img>
                                    <div className={classes.installationProviderCommandWrapper}>
                                        <Typography className={classes.installationProvider}>
                                            {asciinemaTitle}
                                        </Typography>
                                        <Asciinema  src={asciinemaFileSrc} />
                                    </div>
                                </Paper>

                                <Paper className={[classes.paper, classes.installationButtonsWrapper].join(' ')}>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.MongoDB.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.MongoDB.status ? storageProviders.MongoDB.white_logo : storageProviders.MongoDB.logo} alt={t('home.installation.mongodb')}></img>}
                                        onClick={() => displayProviderInstallation('MongoDB')}>
                                        {t('home.installation.mongodb')}
                                    </Button>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.Prometheus.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.Prometheus.status ? storageProviders.Prometheus.white_logo : storageProviders.Prometheus.logo} alt={t('home.installation.prometheus')}></img>}
                                        onClick={() => displayProviderInstallation('Prometheus')}>
                                        {t('home.installation.prometheus')}
                                    </Button>
                                    <Button variant="contained" 
                                        className={[classes.installationButton, classes.installationRightButton, installationButtonStatus.MySQL.status ? classes.installationButtonActive : ''].join(' ')}
                                        startIcon={<img loading="lazy" src={installationButtonStatus.MySQL.status ? storageProviders.MySQL.white_logo : storageProviders.MySQL.logo} alt={t('home.installation.mysql')}></img>}
                                        onClick={() => displayProviderInstallation('MySQL')}>
                                        {t('home.installation.mysql')}
                                    </Button>
                                </Paper>
                            </div>
                        }
                    </div>
                </div>
            </section>

            {/* Section: Join our community */}
            <section>
                <JoinCommunity/>
            </section>
            {/* Section: Community events */}
                <section>
                    {!isMobileView && 
                    <Typography variant="h2" className={classes.sectionTitle}>
                        {t("community.communityEvents.title")}
                    </Typography>
                    }
                    <Grid container spacing={3} className={events.length ? '' : classes.noEvents}>
                        <Grid item xs={12} sm={!isMobileView ? 3 : 12} xl={3} className={`${classes.imageFluid}`}>
                        <LazyLoadImage effect="blur" loading="lazy" src="../images/svg/community.svg" alt={t("community.communityEvents.communityImageAlt")} />
                            {isMobileView && 
                            <Typography variant="h2" className={classes.sectionTitle}>
                                {t("community.communityEvents.title")}
                            </Typography>
                        }
                        </Grid>
                        {events.length ? (
                            <Grid item xs={12} sm={!isMobileView ? 9 : 12} xl={9}>
                                <EventSlider />
                            </Grid>
                        ) : (
                            <Typography variant="h4" className={classes.noEventText}>
                                {t("community.communityEvents.noEvent.message")}
                            </Typography>
                        )}
                    </Grid>
                </section>
            {/* Section: Our adopters say about us */}
            <section>
                {isMobileView && 
                    <Grid item xs={12} className={classes.testimonialMuleWrapper}>
                        <Paper className={[classes.paper, classes.testimonialMule].join(' ')}>
                            <LazyLoadImage effect="blur" loading="lazy" src="../images/png/testimonials_mule.png" alt="" />
                        </Paper>
                    </Grid>
                }
                <Typography variant="h2" className={classes.sectionTitle}>
                    {t('home.adaptorsTestimonials.title')}
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item sm={isMobileView ? 12 : 7} xs={12}>
                        <Paper className={[classes.paper, classes.testimonialPaper].join(' ')}>
                            <Slider {...testimonialSliderSettings}>
                                {adopterTestimonials && adopterTestimonials.map((elm: any ) => {
                                    return (  
                                        <div key={elm.id}>
                                            <div className={classes.testimonialWrapper}> 
                                                {/* <img src={elm.organization} alt={t('home.usedInProductionBy.bloomberg')} /> */}
                                                <Typography className={classes.testimonialTitle}>
                                                    {elm.organization}
                                                </Typography>
                                                <Typography className={classes.testimonialText}>
                                                    {elm.testimonial}
                                                </Typography>
                                                {/* commented code will be used for upcomming releases */}
                                                {/* <div className={classes.testimonialWriterWrapper}>
                                                    <img src={profileURL} alt={writer} />
                                                    <Typography className={classes.testimonialWriter}>{writer}</Typography>
                                                </div> */}
                                            </div>
                                        </div> 
                                        
                                    );
                                })} 
                            </Slider>
                            <div className={classes.adopterButtonWrapper}>
                               <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.adopterButton}
                                    onClick={() => { window.open(EXTERNAL_LINKS.BECOME_ADOPTER, '_blank') }}
                                >
                                    {t("adoptersTestimonials.becomeAdopter")}
                               </Button>
                            </div>
                        </Paper>
                    </Grid>
                    {!isMobileView && 
                        <Grid item sm={5} className={classes.testimonialMuleWrapper}>
                            <Paper className={[classes.paper, classes.testimonialMule].join(' ')}>
                                <LazyLoadImage effect="blur" src="../images/png/testimonials_mule.png" alt="" />
                            </Paper>
                        </Grid>
                    }
                </Grid>
            </section>

            {/* Section: Newsletter */}
            <section>
                <Newsletter newsletterTitle={t("home.newsLetterTitle")} />
            </section>

            {/* Section: Blogs  */}
            <section>
                <MiniBlog />
            </section>

            <div className={classes.footerBackground}>
            {/* Section: You are ready to start */}
            <section>
                <div className={classes.readyToStartSection}>
                    <Typography variant="h2" className={classes.sectionTitle}>
                        {t('home.youAreReadyToStart.title')}
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item md={4} sm={12}>
                            <Paper className={[classes.paper, classes.flyingMuleWrapper].join(' ')}>
                                <span className={classes.flyingMule}>
                                    <LazyLoadImage effect="blur" src="../images/png/flying_mule.png" alt={t('home.youAreReadyToStart.flyingMuleAlt')} />
                                </span>
                            </Paper>
                        </Grid>
                        <Grid item md={8} sm={12} className={classes.maxWidth}>
                            <Grid container spacing={3} alignItems="flex-start" justify="space-between">
                                <Grid item lg={7} sm={6} xs={12}>
                                    <Paper className={[classes.paper, classes.centerContent].join(' ')}>
                                        <div className={[classes.codeWrapper, classes.codeTextHalfWidth].join(' ')}>
                                            <div className={classes.codeBlock}>
                                                <Typography noWrap variant="h5" className={[classes.codeText, classes.codeTextHalfWidthText].join(' ')}>
                                                    {copyCommand.text}
                                                </Typography>

                                                <LightTooltip title={copyCommand.status}>
                                                    <Link onClick={copyToClipboard} className={`${classes.copyIcon} ${classes.imageFluid}`}>
                                                        <img loading="lazy" src="../images/svg/copy_orange.svg" alt="" />
                                                    </Link>
                                                </LightTooltip>
                                            </div>
                                            <Typography className={classes.codeTextDescription}>
                                                {t('home.youAreReadyToStart.copyCodeDescription')}
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                                <Grid item lg={4} sm={6} xs={12}>
                                    <Paper className={[classes.paper, classes.centerContent].join(' ')}>
                                        <div>
                                            <div className={classes.readGuideDiv}>
                                                <Link href={EXTERNAL_LINKS.OPENEBS_DOCS} className={classes.readGuideLink}>
                                                    <Typography className={classes.readGuideTitle}>
                                                        {t('home.youAreReadyToStart.readTheGuide.title')}
                                                    </Typography>
                                                    <IconButton className={classes.iconButton}>
                                                        <img loading="lazy" src="../images/svg/arrow_orange.svg" alt={t('header.submitAlt')}/>
                                                    </IconButton>
                                                </Link>
                                            </div>
                                            <Typography className={classes.readGuideDescription}>
                                                {t('home.youAreReadyToStart.readTheGuide.description')}
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </section>

            {/* Display footer */}
            <footer className={classes.footer}>
                <Footer />
            </footer> 
        </div>
    </div>
    );
};

export default React.memo(Home);