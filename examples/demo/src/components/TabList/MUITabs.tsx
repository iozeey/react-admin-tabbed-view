import { Tabs, Tab } from '@mui/material';
import React, { FC } from 'react';

export interface TabListProps {
    tabList: any[];
    filterValue: any;
    onChange: (event: React.ChangeEvent<{}>, value: any) => void;
    getLabel: Function;
}

const MUITabs: FC<TabListProps> = ({
    tabList,
    filterValue,
    onChange,
    getLabel,
}) => (
    <Tabs
        variant="fullWidth"
        centered
        value={filterValue}
        indicatorColor="primary"
        onChange={onChange}
    >
        {tabList.map(choice => (
            <Tab key={choice.id} label={getLabel(choice)} value={choice.id} />
        ))}
    </Tabs>
);
export default MUITabs;
