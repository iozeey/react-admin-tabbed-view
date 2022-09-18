import { useMediaQuery, Theme } from '@mui/material';

interface AcceptableViews {
    mobileView?: any;
    desktopView: any;
}

const ReactAdminListContainer: React.FC<AcceptableViews> = ({
    mobileView: MobileView,
    desktopView: DesktopView,
}) => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

    if (isXSmall) return <MobileView />;

    return <DesktopView />;
};

export default ReactAdminListContainer;
