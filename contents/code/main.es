function init()
{
    comic.comicAuthor = "Tom Fischbach";
    comic.firstIdentifier = "1";
    comic.websiteUrl = "https://twokinds.keenspot.com/";
    comic.shopUrl = "https://keenspotshop.com/collections/twokinds";
    
    //handle if an identifier is supplied
    if (comic.identifier != new String()) {
        comic.websiteUrl += comic.identifier;
        comic.requestPage(comic.websiteUrl, comic.Page);
    } else {
        comic.requestPage(comic.websiteUrl, comic.User);
    }
}

function pageRetrieved(id, data)
{
    /* find permenant id for latest page, id should only == comic.User if it was
     * with the base url
     */
    if (id == comic.User) {
        var re = new RegExp('<a href="([^"]*)">Permalink</a>');
        var match = re.exec(data);
        if (match != null) {
            comic.lastIdentifier = match[1];
            comic.identifier = comic.lastIdentifier;
            comic.websiteUrl += comic.identifier;
            comic.requestPage(comic.websiteUrl, comic.Page);
        } else {
            comic.error();
        }
    }
    
    //get comic image and other metadata
    if (id == comic.Page) {
        /* first group catches the image URL, second group catches page title
         * most of the shenaniganery is to match any whitespace because the source
         * is weird
         */
        var re = new RegExp("<img\\s+src=\"([^\"]*)\"\\s+title=\"([^\"]*)\"\\s+alt=\"Comic Page\"");
        var match = re.exec(data);
        
        if (match != null) {
            comic.title = match[2];
            comic.requestPage(match[1], comic.Image);
        } else {
            comic.error();
            return;
        }
        
        //get id of previous page
        re = new RegExp("<a href=\"/(comic/[^\"]*)\" class=\"navarrow navprev\">");
        match = re.exec(data);
        if (match != null) {
            comic.previousIdentifier = match[1];
        }
        
        //get id of next page
        re = new RegExp("<a href=\"/(comic/[^\"]*)\" class=\"navarrow navnext\">");
        match = re.exec(data);
        if (match != null) {
            comic.nextIdentifier = match[1];
        }
    }
}
