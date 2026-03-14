# TODO

## Pagination UX: Return All / Limit Pattern

The current implementation fixes page/per_page defaults (page=1, per_page=20 instead of 0),
but does not yet implement the full n8n-standard pagination UX pattern.

### What's needed

For all "Get Many" operations, replace the raw Page / Per Page number fields with:

1. **Return All** toggle (boolean, default false)
2. **Limit** field (number, shown when Return All is false, default 50)
3. Auto-pagination logic that:
   - When Return All = true: fetches all pages automatically
   - When Return All = false: fetches up to the Limit count
   - Hides the raw Page / Per Page fields

### Why deferred

Adding Return All / Limit requires:
- Custom execute function or pagination-aware `postReceive` that makes multiple API calls
- Hiding/showing fields dynamically based on toggle state
- Significant testing across all list endpoints
- Potential changes to the declarative routing approach (may need programmatic execution)

### Affected resources

All "Get Many" operations across: Subscribers, Lists, Campaigns, Bounces, Media, Templates, Import, Logs, Settings, Public.
