function EmptyStateMessage({isSingleProductMode }){
    return(
        <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '18px' }}>
            {isSingleProductMode ? 'Product data not found.' : 'No products match the current filters.'}
        </div>
    );
}
export default EmptyStateMessage;