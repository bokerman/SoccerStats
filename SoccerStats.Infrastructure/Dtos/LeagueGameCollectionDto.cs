public class LeagueGameCollectionDto
{
    public string LeagueCode { get; set; }
    public string LeagueName { get; set; }
    public List<MatchDto>Matches { get; set; } = new List<MatchDto>();
    
}
