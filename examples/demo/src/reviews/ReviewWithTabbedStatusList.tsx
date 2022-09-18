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
    { id: 'accepted', name: 'accepted' },
    { id: 'pending', name: 'pending' },
    { id: 'rejected', name: 'rejected' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalAccepted } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'accepted' },
    });
    const { total: totalPending } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'pending' },
    });
    const { total: totalRejected } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'rejected' },
    });

    return {
        accepted: totalAccepted,
        pending: totalPending,
        rejected: totalRejected,
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
                    { ...filterValues, status: value },
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
