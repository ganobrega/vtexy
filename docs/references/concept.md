# Concept

Here are some concepts of how VTEXY works.

Check below the [Data Structure]() and [Content Structure]().

## Data Structure

The follow graph shows how VTEXY sees the folder structure inside the `data/` directory.

![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcblx0QVtcImRhdGEvXCJdIC0tLSBCW1wic2l0ZXMvwqBcIl1cbiAgQiAtLS0gSltcIlt3ZWJzaXRlIG5hbWVdL1wiXVxuICBKIC0tLSBDW1wicm91dGVzL1wiXVxuICBKIC0tLSBEW1wiXy5qc29uY1wiXVxuICBDIC0tLSBFW1wiKi5qc29uY1wiXVxuICBDIC0tLSBLW1wiXy5qc29uY1wiXVxuICBDIC0tLSBGW1wiKiovXCJdXG4gIEYgLS0tIEhbXCJfLmpzb25jXCJdXG4gIEYgLS0tIElbXCIqLmpzb25jXCJdXG5cbiAgY2xhc3NEZWYgQUZDMkU1IGZpbGw6I0FGQzJFNSxzdHJva2U6IzMzM1xuICBjbGFzc0RlZiBEOEM4RTkgZmlsbDojRDhDOEU5LHN0cm9rZTojMzMzXG4gIGNsYXNzRGVmIEQ2RThBQiBmaWxsOiNENkU4QUIsc3Ryb2tlOiMzMzNcbiAgY2xhc3MgRCBBRkMyRTVcbiAgY2xhc3MgRSxJIEQ4QzhFOVxuICBjbGFzcyBILEsgRDZFOEFCIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

[Edit on Mermaid Live Editor](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcblx0QVtcImRhdGEvXCJdIC0tLSBCW1wic2l0ZXMvwqBcIl1cbiAgQiAtLS0gSltcIlt3ZWJzaXRlIG5hbWVdL1wiXVxuICBKIC0tLSBDW1wicm91dGVzL1wiXVxuICBKIC0tLSBEW1wiXy5qc29uY1wiXVxuICBDIC0tLSBFW1wiKi5qc29uY1wiXVxuICBDIC0tLSBLW1wiXy5qc29uY1wiXVxuICBDIC0tLSBGW1wiKiovXCJdXG4gIEYgLS0tIEhbXCJfLmpzb25jXCJdXG4gIEYgLS0tIElbXCIqLmpzb25jXCJdXG5cbiAgY2xhc3NEZWYgQUZDMkU1IGZpbGw6I0FGQzJFNSxzdHJva2U6IzMzM1xuICBjbGFzc0RlZiBEOEM4RTkgZmlsbDojRDhDOEU5LHN0cm9rZTojMzMzXG4gIGNsYXNzRGVmIEQ2RThBQiBmaWxsOiNENkU4QUIsc3Ryb2tlOiMzMzNcbiAgY2xhc3MgRCBBRkMyRTVcbiAgY2xhc3MgRSxJIEQ4QzhFOVxuICBjbGFzcyBILEsgRDZFOEFCIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

**Legend**

| Image                                               | Scope                                      |
| --------------------------------------------------- | ------------------------------------------ |
| ![](https://via.placeholder.com/16/AFC2E5?text=%20) | [Website Schema](/references/data#website) |
| ![](https://via.placeholder.com/16/D8C8E9?text=%20) | [Layout Schema](/references/data#layout)   |
| ![](https://via.placeholder.com/16/D6E8AB?text=%20) | [Folder Schema](/references/data#folder)   |

#### Purpose of data

The purpose of this structure is to base it on VTEX's CMS.

Where we have `sites/` as well as `Sites and Channels` on CMS.

Within the `sites/` directory we have subdirectories that play the role of Website.

In the `[website]/` directory we have the abstraction of the website concept in the CMS, that is, we have a file for the **settings** (`_.jsonc`) and a folder for the **Layouts** (`routes/`).

Finally, we have the `routes/` folder, which has the same concept as in the CMS. Inside we have folders that become the URL paths and inside each **Folder** we have **Layouts** and a configuration file `_.jsonc` for **Folder Settings**.

For each file check the schema in [Data](/references/data).

> ##### Let's talk about underscores as filenames
>
> Well, i dont like the idea to use **_underscores_** as filename. But, in the case of abstraction of properties hierarchly, we want to give you an idea that the file is for the configuration of the `folder` or `website` that is at the same hierarchical level.
> Maybe this can be discussed in the future.

> ##### Why not save these datas on a database
>
> Integrations with database like _MongoDB_ or _Mysql_ will be considered in the future

## Content Structure

Comming soon
