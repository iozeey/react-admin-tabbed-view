import {
    BooleanField,
    Datagrid,
    DateField,
    NumberField,
    ReferenceField,
    TextField,
} from 'react-admin';

import AddressField from '../visitors/AddressField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import NbItemsField from './NbItemsField';

interface TabbedGridProps {
    optimized: any;
    isAddBoolField: any;
}
const TabbedGridCommonFields: React.FC<TabbedGridProps> = ({
    optimized,
    isAddBoolField,
}) => (
    <Datagrid optimized={optimized} rowClick="edit">
        <DateField source="date" showTime />
        <TextField source="reference" />
        <CustomerReferenceField />
        <ReferenceField
            source="customer_id"
            reference="customers"
            link={false}
            label="resources.commands.fields.address"
        >
            <AddressField />
        </ReferenceField>
        <NbItemsField />
        <NumberField
            source="total"
            options={{
                style: 'currency',
                currency: 'USD',
            }}
            sx={{ fontWeight: 'bold' }}
        />
        {isAddBoolField && (
            <BooleanField source="returned" sx={{ mt: -0.5, mb: -0.5 }} />
        )}
    </Datagrid>
);

export default TabbedGridCommonFields;
