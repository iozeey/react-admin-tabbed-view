import { Divider } from '@mui/material';
import * as React from 'react';
import { Fragment, useCallback } from 'react';
import {
    AutocompleteInput,
    DateInput,
    NullableBooleanInput,
    ReferenceInput,
    SearchInput,
    TextInput,
    useGetList,
    useListContext,
} from 'react-admin';
import MUITabs from '../components/TabList/MUITabs';
import ReactAdminList from '../components/TabList/ReactAdminList';
import ReactAdminListContainer from '../components/TabList/ReactAdminListContainer';
import { Customer } from '../types';
import MobileGrid from './MobileGrid';
import TabbedGridCommonFields from './TabbedGridCommonFields';

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="customer_id" reference="customers">
        <AutocompleteInput
            optionText={(choice?: Customer) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.first_name} ${choice.last_name}`
                    : ''
            }
        />
    </ReferenceInput>,
    <DateInput source="date_gte" />,
    <DateInput source="date_lte" />,
    <TextInput source="total_gte" />,
    <NullableBooleanInput source="returned" />,
];

const tabs = [
    { id: 'ordered', name: 'ordered' },
    { id: 'delivered', name: 'delivered' },
    { id: 'cancelled', name: 'cancelled' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalOrdered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'ordered' },
    });
    const { total: totalDelivered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'delivered' },
    });
    const { total: totalCancelled } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'cancelled' },
    });

    return {
        ordered: totalOrdered,
        delivered: totalDelivered,
        cancelled: totalCancelled,
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

    const DesktopView = () => (
        <>
            {filterValues.status === 'ordered' && (
                <TabbedGridCommonFields optimized isAddBoolField={false} />
            )}
            {filterValues.status === 'delivered' && (
                <TabbedGridCommonFields optimized={false} isAddBoolField />
            )}
            {filterValues.status === 'cancelled' && (
                <TabbedGridCommonFields optimized={false} isAddBoolField />
            )}
        </>
    );

    return (
        <Fragment>
            <MUITabs
                tabList={tabs}
                filterValue={filterValues.status}
                onChange={handleChange}
                getLabel={getLabel}
            />
            <Divider />
            <ReactAdminListContainer
                mobileView={MobileGrid}
                desktopView={DesktopView}
            />
        </Fragment>
    );
};

const OrderList = () => ReactAdminList(orderFilters, <TabbedGrid />);

export default OrderList;
