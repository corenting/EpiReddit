//
//  Post.swift
//  EpiReddit
//
//  Created by Corentin Garcia on 29/06/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import Foundation

class Post {
    var id:Int
    var content:String?
    var link:String?
    var createdAt:Date
    var categoryName:String
    var upvotes:Int
    var username:String
    var title:String
    var picture:String?
    
    var upvoted:Bool
    var downvoted:Bool
    
    init(id:Int) {
        self.id = id
        self.content = ""
        self.link = ""
        self.createdAt = Date()
        self.categoryName = ""
        self.upvotes = 0
        self.username = ""
        self.title = ""
        self.picture = ""
        self.upvoted = false
        self.downvoted = false
    }
}
