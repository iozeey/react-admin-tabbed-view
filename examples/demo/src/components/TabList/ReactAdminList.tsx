import { List } from 'react-admin';

const ReactAdminList = (filters: any, component: any) => (
    <List
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={filters}
    >
        {component}
    </List>
);

export default ReactAdminList;
