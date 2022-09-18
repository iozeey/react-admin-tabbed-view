import { Divider, Drawer } from '@mui/material';
import * as React from 'react';
import { useCallback } from 'react';
import { useGetList, useListContext } from 'react-admin';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import MUITabs from '../components/TabList/MUITabs';
import ReactAdminList from '../components/TabList/ReactAdminList';
import ReactAdminListContainer from '../components/TabList/ReactAdminListContainer';
import ReviewEdit from './ReviewEdit';
import reviewFilters from './reviewFilters';
import ReviewListDesktop from './ReviewListDesktop';
import ReviewListMobile from './ReviewListMobile';

const tabs = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
    { id: '4', name: 'Four' },
    { id: '5', name: 'Five' },
];

const useGetTotals = (filterValues: any) => {
    const { total: oneStar } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 1 },
    });
    const { total: twoStar } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 2 },
    });
    const { total: threeStar } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 3 },
    });
    const { total: fourStar } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 4 },
    });
    const { total: fiveStar } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 5 },
    });

    return {
        One: oneStar,
        Two: twoStar,
        Three: threeStar,
        Four: fourStar,
        Five: fiveStar,
    };
};

const TabbedGrid = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;

    const totals = useGetTotals(filterValues) as any;

    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, rating: value },
                    displayedFilters,
                    false // no debounce, we want the filter to fire immediately
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const getLabel = (choice: any) => {
        return totals[choice.name]
            ? `${choice.name} (${totals[choice.name]})`
            : choice.name;
    };

    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate('/reviews');
    }, [navigate]);

    const match = matchPath('/reviews/:id', location.pathname);

    return (
        <>
            <MUITabs
                tabList={tabs}
                filterValue={filterValues}
                onChange={handleChange}
                getLabel={getLabel}
            />
            <Divider />
            <ReactAdminListContainer
                mobileView={ReviewListMobile}
                desktopView={() => (
                    <ReviewListDesktop
                        selectedRow={
                            !!match
                                ? parseInt((match as any).params.id, 10)
                                : undefined
                        }
                    />
                )}
            />
            <Drawer
                variant="persistent"
                open={!!match}
                anchor="right"
                onClose={handleClose}
                sx={{ zIndex: 100 }}
            >
                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                {!!match && (
                    <ReviewEdit
                        id={(match as any).params.id}
                        onCancel={handleClose}
                    />
                )}
            </Drawer>
        </>
    );
};

const ReviewList = () => ReactAdminList(reviewFilters, <TabbedGrid />);

export default ReviewList;
